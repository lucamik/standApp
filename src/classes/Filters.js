
export const filterActivitiesByMemberAndDate = (data, idMember, date) => {
    return data.filter((item) => {
        let convDate = new Date(new Date(item.date).toLocaleString("en-US"));
        return item.idMemberCreator === idMember &&
            convDate.getDate() === date.getDate() &&
            convDate.getMonth() === date.getMonth() &&
            convDate.getFullYear() === date.getFullYear()
    });
}

export const filterBoardsByTeam = (data, team) => {
    return data.filter(board =>
        board.name.indexOf('Sprint | ' + team.charAt(0).toUpperCase() + team.substring(1) + ' | ') === 0
    ).map((board) => {
        return {'id': board.shortLink, 'name': board.name}
    })
}