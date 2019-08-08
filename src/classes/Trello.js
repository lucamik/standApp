import {filterActivitiesPerMemberAndDate, filterBoardsByTeam} from "./Filters";

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
        data: null,
        error: null
    }

    await fetch('https://api.trello.com/1/boards/' + boardId +
        '/actions?key=' + apiKey + '&token=' + token)
        .then(response => {
            if (response.status !== 200) {
                throw new Error(response.status)
            }
            return response.json()
        })
        .then(data => {
            result.data = filterActivitiesPerMemberAndDate(data, memberId, date)
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