const fs = require('fs'); 

let data = "This is a file containing a collection of books."; 

fs.writeFile("books.txt", data, (err) => { 
    if (err) 
      console.log(err); 
    else { 
        console.log('File has been written successfully!');
    } 
  }); 