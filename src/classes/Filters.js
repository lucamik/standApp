
export const filterActionsByMember = (data, idMember) => {
    return data.filter((item) =>
        item.idMemberCreator === idMember
    );
}

export const filterBoardsByTeam = (data, team) => {
    return data.filter(board =>
        board.name.indexOf('Sprint | ' + team.charAt(0).toUpperCase() + team.substring(1) + ' | ') === 0
    ).map((board) => {
        return {'id': board.shortLink, 'name': board.name, 'date': board.dateLastActivity}
    }).sort((a, b) => new Date(b.date) - new Date(a.date))
}