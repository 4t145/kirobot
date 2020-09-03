const FileSystem = require('fs');
var fl = ""

var buf = FileSystem.readFileSync("./asset/list.json");
var kaoyan_dict = JSON.parse(buf.toString())
var resp = ''
for (let index = 0; index < parseInt(10) ; index++) {
    let word_ind = Math.floor(Math.random()*kaoyan_dict.length)
    resp += (parseInt(word_ind,10) + '\t' + kaoyan_dict[word_ind] + '\n')
}

console.log(resp)