function dateFormat(time){
    const date = new Date(time);
    const localTime = date.toLocaleDateString('en-US', {
        weekday : 'short',
        month : 'short',
        hour : '2-digit',
        minute : '2-digit',
        hour12 : true 
    });

    return `${date.getDate()} ${localTime}`;
}

export default dateFormat