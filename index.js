const express = require('express');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3034
app.listen(port, () => console.log(`Listening on port${port}...`) );

const firebase = require("firebase/app")
require("firebase/firestore")

const config = {
    apiKey: "AIzaSyBCUHDh7MTxfrv8xA35QZ0Ugti1EddvVPI",
    authDomain: "db-testiig.firebaseapp.com",
    projectId: "db-testiig",
    storageBucket: "db-testiig.appspot.com",
    messagingSenderId: "218807231894",
    appId: "1:218807231894:web:6c2d107a7f5858b959e9b7",
    measurementId: "G-2LYDR2N2ZQ"
  };

  firebase.initializeApp(config);
  let firestore = firebase.firestore()

var cors = require('cors');
const { urlencoded } = require('express');

app.use(cors()) // Use this after the variable declaration

var uuid = require('uuid');

app.post('/post/user', (req, res) => {
    const { v4: uuidv4 } = require('uuid');
    uuidv4(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
    const user = {
        user:req.body.user,
        pw:req.body.pw,
        fname:req.body.fname,
        lname:req.body.lname,
        auth:true,
        id:uuidv4(),
        cpw:[]
        // img:null
    }
    let baseString = user.pw
    const CryptoJS = require('crypto-js');
    // const crypto = require("crypto");
      var cipher = CryptoJS.AES.encrypt(baseString, "CIPHERKEY");
      cipher = cipher.toString();
    // const algorithm = "aes-256-cbc"; 

    // // generate 16 bytes of random data
    // const initVector = crypto.randomBytes(16);
    
    // // protected data
    // const message = user.pw;
    
    // // secret key generate 32 bytes of random data
    // const Securitykey = crypto.randomBytes(32);
    
    // // the cipher function
    // const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    
    // // encrypt the message
    // // input encoding
    // // output encoding
    // let encryptedData = cipher.update(message, "utf-8", "hex");
    
    // encryptedData += cipher.final("hex");
    
    // console.log("Encrypted message: " + encryptedData);
    user.cpw.push(cipher)
    user.pw = cipher
    // user.cpw.push(encryptedData)
    // user.pw = encryptedData
//     const imgurl = null
//     const storageRef=firebase.storage().ref(user.img.name).put(user.img);
//   storageRef.on(`state_changed`,snapshot=>{
//   this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
//     }, error=>{console.log(error.message)},
//     ()=>{this.uploadValue=100;
//         storageRef.snapshot.ref.getDownloadURL().then((url)=>{
//             imgurl =url;
//             console.log(imgurl)
//           });
//         }      
//       );

    firestore.collection("users").doc(user.id).set({ 
        user: user.user,
        pw:user.pw,
        fname:user.fname,
        lname:user.lname,
        auth:user.auth,
        id:user.id,
        cpw:user.cpw
        // img:imgurl

    });
    res.json(user);
});
////get all username
app.get('/get/users', (req,res) => {
    firestore.collection("users").get().then(function(snapshot){
        let s = []
        snapshot.forEach(function(docs){
            // console.log(docs.data());
            s.push(docs.data().user)
        })
        res.json(s);
    });
});
//get 1 user
app.get('/get/profile/:doc', (req,res) => {
    firestore.collection("users").doc(req.params.doc).get().then(function (docs) {
        res.json(docs.data());
    });
});
app.get('/get/profiles', (req,res) => {
    firestore.collection("users").get().then(function(snapshot){
        let s = []
        snapshot.forEach(function(docs){
            // console.log(docs.data());
            s.push(docs.data())
        })
        res.json(s);
    });
});
app.get('/get/profiles/pw', (req,res) => {
    firestore.collection("users").get().then(function(snapshot){
        let s = []
        snapshot.forEach(function(docs){
            // console.log(docs.data());
            s.push(docs.data().pw)
        })
        res.json(s);
    });
});
app.get('/get/profiles/id', (req,res) => {
    firestore.collection("users").get().then(function(snapshot){
        let s = []
        snapshot.forEach(function(docs){
            // console.log(docs.data());
            s.push(docs.data().id)
        })
        res.json(s);
    });
});
//แก้ไข profile
app.put('/edit/user/:doc', (req, res) => {
    const edit = {
        user: req.body.user,
        fname: req.body.fname,
        lname: req.body.lname
    }
    firestore.collection("users").doc(req.params.doc).update({ 
        user: edit.user,
        fname: edit.fname,
        lname: edit.lname
    });
        res.json(edit);
});

app.put('/edit/pw/:doc',async (req, res) => {
    const edit = {
        pw:req.body.pw,
        cpw:[]
    }
    // let npw = []
    await firestore.collection("users").doc(req.params.doc).get().then(function (docs) {
        // res.json(docs.data());
        console.log('xzxzxzxz', docs.data().pcw);
        // npw.push("data()")
    });
    let baseString = edit.pw
    const CryptoJS = require('crypto-js');
      var cipher = CryptoJS.AES.encrypt(baseString, "CIPHERKEY");
      cipher = cipher.toString();
    edit.cpw.push(cipher)
    edit.pw = cipher
    firestore.collection("users").doc(req.params.doc).update({ 
        pw:edit.pw,
        cpw:edit.cpw
    });
        res.json(edit);
});
// app.get('/get/profile/pw/:doc', (req,res) => {
//     // const CryptoJS = require('crypto-js')
//     firestore.collection("users").doc(req.params.doc).get().then(function (docs) {
//     //   const decipher = CryptoJS.AES.decrypt(docs.data().pw, 'CIPHERKEY')
//     //   console.log('decipher', decipher)
//     //   const plaintext = decipher.toString(CryptoJS.enc.Utf8)
//     //   console.log('planintext', plaintext)
//     //   var encrypt = require("ncrypt-js")
//     //   var decrypt = require("ncrypt-js")
// // let encryptData = new encrypt("super secret data", "secret_key")
// // var decryptedData = new decrypt(encryptData);
// // console.log(decryptedData); // super secret data
// // console.log(decryptedData); 
// // console.log(encryptData);
// // var encrypted = CryptoJS.AES.encrypt("aaa", "Secret Passphrase");
// // var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");
// // console.log(encrypted.toString());
// // console.log(decrypted.toString());
// // crypto module


//     const crypto = require("crypto");
//     const algorithm = "aes-256-cbc"; 
//     const initVector = crypto.randomBytes(16);
//     const message = 'docs.data().pw';
//     const Securitykey = crypto.randomBytes(32);
//     const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

//     let encryptedData = cipher.update(message, "utf-8", "hex");
//     encryptedData += cipher.final("hex");
//     console.log("Encrypted message: " + encryptedData, typeof encryptedData);

//     const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
//     let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
//     decryptedData += decipher.final("utf8");
//     console.log("Decrypted message: " + decryptedData);
//         res.json(docs.data().pw);
//     });
// });

app.get('/get/changepw/:doc', (req,res) => {
    firestore.collection("users").doc(req.params.doc).get().then(function (docs) {
        // res.json(docs.data());
        let pw = dosc.data().pwc
        const nwepw = { pw:req.body.pw}

    });
});
