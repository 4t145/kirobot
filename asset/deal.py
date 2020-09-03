import json

file_dict = open("./dict.json", 'r', encoding= 'utf-8')

line = file_dict.readline() 


word_list = []
while line:                  
    obj = json.loads(line)
    word = obj["headWord"]
    line = file_dict.readline()
    word_list.append(word)
file_dict.close()


file_list = open("./list.json", "w")
file_list.write(json.dumps(word_list))

