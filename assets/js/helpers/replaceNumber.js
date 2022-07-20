function replaceNumber (number) {
    return number.replace('(','').replace(')', '').replace(' ','').replace('-','');
}

export default replaceNumber