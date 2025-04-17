import moment from "moment";

export const formatDate = (date, time) => {
	const regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}/
    const regex2 = /^[0-9]{2}-[0-9]{2}-[0-9]{4}/
    const regex3 = /^[0-9]{4}[/][0-9]{2}[/][0-9]{2}/
    const regex4 = /^[0-9]{2}[/][0-9]{2}[/][0-9]{4}/

    function checkIfTrue(date){
        if(regex.test(date) || regex2.test(date) || regex3.test(date) || regex4.test(date)){
          return true
        }
        return false
    }

    if(checkIfTrue(date) && time){
        return `${moment(date).format("Do")} of ${moment(date).format(
        "MMMM"
        )} at ${moment(date).format("HH:mm")}`  
    }

    if(checkIfTrue(date) && !time){
         return `${moment(date).format("Do")} of ${moment(date).format(
        "MMMM"
        )}, ${moment(date).format("YYYY")}`
    }

    return date;
}