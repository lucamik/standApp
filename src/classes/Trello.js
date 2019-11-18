import {filterActionsByMember, filterBoardsByTeam} from "./Filters";

export const getMemberInfo = async (apiKey, token) => {
    let memberInfo = {
        memberId: null,
        memberFullName: null,
        error: null
    }

    await fetch('https://api.trello.com/1/member/me?key=' + apiKey + '&token=' + token)
        .then(response => response.json())
        .then(
            (data) => {
                memberInfo.memberId = data.id
                memberInfo.memberFullName = data.fullName
            },
            (error) => {
                memberInfo.error = 'Could not find any user with these credentials'
            }
        )

    return memberInfo
}

export const getBoards = async (apiKey, token, team) => {
    let boards = []

    await fetch('https://api.trello.com/1/member/me/boards?key=' + apiKey + '&token=' + token)
        .then(response => response.json())
        .then(
            (data) => {
                boards = filterBoardsByTeam(data, team)
            },
            (error) => {
                console.log(error)
            }
        )

    return boards
}

export const getActionsByBoardId = async (apiKey, token, boardId, memberId, date) => {
    let result = {
        data: [],
        error: null
    }

    let nextDay = new Date(date.getTime());
    nextDay.setDate(date.getDate()+1);

    await fetch('https://api.trello.com/1/boards/' + boardId +
        '/actions?key=' + apiKey + '&token=' + token +
        '&since=' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +
        '&before=' + nextDay.getFullYear() + '-' + (nextDay.getMonth() + 1) + '-' + nextDay.getDate() +
        '&limit=1000')
        .then(response => {
            if (response.status !== 200) {
                throw new Error(response.status)
            }
            return response.json()
        })
        .then(async data => {
            result.data = filterActionsByMember(data, memberId)

            let labelData = []
            await getCardLabels(apiKey, token, result.data).then(label =>
                labelData = label
            )

            let storyCustomField = {}
            await fetch('https://api.trello.com/1/boards/' + boardId + '/customFields?key=' + apiKey + '&token=' + token)
                .then(response => response.json())
                .then(data => {
                    storyCustomField = data.filter(field => field.name === 'Story')[0]
                })

            let storyColorData = []
            await getStoryColor(apiKey, token, result.data, storyCustomField).then(customField =>
                storyColorData = customField
            )

            let currentListData = []
            await getCurrentList(apiKey, token, result.data).then(currentList =>
                currentListData = currentList
            )

            let tempData = []
            result.data.forEach(item => {
                if (item.data.card) {
                    item.labelInfo = labelData.filter(label => label.cardId === item.data.card.id)[0]
                    item.currentList = currentListData.filter(list => list.cardId === item.data.card.id)[0].list
                    item.storyColor = storyColorData.filter(color => color.cardId === item.data.card.id)[0].color
                    tempData.push(item)
                }
            })

            result.data = tempData
        }, (error) => {
            let errorMsg
            let errorCode = error.toString().match(/\d+/).map(Number)[0]

            switch (errorCode) {
                case 400:
                    errorMsg = 'Invalid Board'
                    break
                case 401:
                    errorMsg = 'Wrong credentials. Access denied'
                    break
                default:
                    errorMsg = 'Unknown error'
            }

            result.error = errorMsg
        })

    return result
}

const getCardLabels = (apiKey, token, data) => {
    let urls = []

    data.forEach(item => {
        if (item.data.card) {
            urls.push({
                cardId: item.data.card.id, url: 'https://api.trello.com/1/card/' + item.data.card.id + '/labels' +
                '?key=' + apiKey + '&token=' + token
            })
        }
    })

    const allRequests = urls.map(urlInfo =>
        fetch(urlInfo.url)
            .then(response => response.json())
            .then(data => {
                return {cardId: urlInfo.cardId, colors: data}
            })
    )

    return Promise.all(allRequests);
}

const getStoryColor = (apiKey, token, data, storyCustomField) => {
    let urls = []

    data.forEach(item => {
        if (item.data.card) {
            urls.push({
                cardId: item.data.card.id, url: 'https://api.trello.com/1/card/' + item.data.card.id + '/customFieldItems' +
                '?key=' + apiKey + '&token=' + token
            })
        }
    })

    const allRequests = urls.map(urlInfo =>
        fetch(urlInfo.url)
            .then(response => response.json())
            .then(data => {
                let storyColorValue = data.filter(storyData => {
                    return storyData.idCustomField === storyCustomField.id
                })[0].idValue
                let color = storyCustomField.options.filter(option => {
                    return storyColorValue === option.id
                })[0].color
                return {cardId: urlInfo.cardId, color: color}
            })
    )

    return Promise.all(allRequests);
}

const getCurrentList = (apiKey, token, data) => {
    let urls = []

    data.forEach(item => {
        if (item.data.card) {
            urls.push({
                cardId: item.data.card.id, url: 'https://api.trello.com/1/card/' + item.data.card.id + '/list' +
                '?key=' + apiKey + '&token=' + token
            })
        }
    })

    const allRequests = urls.map(urlInfo =>
        fetch(urlInfo.url)
            .then(response => response.json())
            .then(data => {
                return {cardId: urlInfo.cardId, list: data.name}
            })
    )

    return Promise.all(allRequests);
}