import {filterActivitiesPerMemberAndDate} from "./Filters";

export const getMemberInfo = async (username) => {
    let memberInfo = {
        memberId: null,
        memberFullName: null,
        error: null
    }

    await fetch('https://api.trello.com/1/members/' + username)
        .then(response => response.json())
        .then(
            (data) => {
                memberInfo.memberId = data.id
                memberInfo.memberFullName = data.fullName
            },
            (error) => {
                memberInfo.error = 'Username does not exist'
            }
        )

    return memberInfo
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
                    errorMsg = 'Invalid Board Id'
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