export function kConverter(num){
    if(num >= 10000){
        return (num / 1000).toFixed(1) + 'k';
    }
    else{
        return num;
    }
}