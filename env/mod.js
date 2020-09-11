const FileSystem = require('fs');

const fict_buf = FileSystem.readFileSync("./env/asset/list.json");
const kaoyan_dict = JSON.parse(fict_buf.toString());
const avbangou_prefix_buf = FileSystem.readFileSync("./env/asset/prefix_table.json");
const bangou_prefix = JSON.parse(avbangou_prefix_buf.toString());

module.exports = {  
    saucenao_api_key: '2c44a50ebe753c0f2f17f24f3ee3e4caa3a05cd7',
    btsow_base_url: 'https://btsow.website/',
    kaoyan_dict: kaoyan_dict,
    bangou_prefix: bangou_prefix,
}