
export const filterActivitiesPerMemberAndDate = (data, idMember, date) => {
    return data.filter((item) => {
        let convDate = new Date(new Date(item.date).toLocaleString("en-US"));
        return item.idMemberCreator === idMember &&
            convDate.getDate() === date.getDate() &&
            convDate.getMonth() === date.getMonth() &&
            convDate.getFullYear() === date.getFullYear()
    });
}