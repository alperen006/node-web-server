
const express = require('express');   // express modülü çağırma

var app = express();  // kütüphaneden bir obje oluşturduk.

const fs = require('fs');

// https://expressjs.com/en/starter/static-files.html
//app.use(); methodu parametre olarak kullanmak istedigimiz middleware bir fonksiyon alır.
app.use(express.static(__dirname + '/public'));     // static methodu parametre olarak sunmak istedigin static dosyaların yolunu alırr..
// __dirname, 009_node-web-server klasörümün yolunu alır..
// şimdi artık localhost:3000/ dedikten sonra public klasörü içerisindeki herhangi html dosyasını çağırabilirsin.
// localhost:3000/help.html  gibi..

//app.use(); methodu parametre olarak kullanmak istedigimiz middleware bir fonksiyon alır.
app.use('/tarih', (req, res, next) => { // bu şekilde kullanırsak eğer localhost:3000/tarih linki açıldıgında bu middleware fonksiyonu tetiklenecektir.
  console.log('23.02.2018');
  next();  // next fonksiyonunu çağırmamızın nedeni kod işlemeye devam etsin diyedir yoksa burada kalacaktır.
});

app.use((req, res, next) => { // bu şekilde kullanırsak eğer localhost:3000/ linki açıldıgında bu middleware fonksiyonu tetiklenecektir.
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;                             // yani default olarak çalışır her zaman..
  console.log(log);
  fs.appendFile('./server.log', log + '\n', (err) => {
    if(err){
      console.log('Unable to append to server.log!');
    }
  });
  next();  // next fonksiyonunu çağırmamızın nedeni kod işlemeye devam etsin diyedir yoksa burada kalacaktır.
});

app.use((req, res, next) => {
  res.render('maintenance.hbs');
});
// next fonksiyonunu çağırmadığımız için kod burada kalacaktır!! ne yaparsan yap :D :D
// fakat bu koddan önce tanımlanan app.use kodları da işlenecektir.. localhost:3000/help.html diyerek test edebilirsin..
// çünkü o kod'ta app.use methouyla çagırıldıgı için ve bu koddan önce oldugu için mecbur işlemiş bulunuyor
// eğer bu kodu diğer app.use kodlarının başına alırsak diğer app.use kodlarını engelleyecektir.!!!

app.get('/sevenler', (req, res) => {
  //res.send('<h1>Hello Express!</h1>');   // send methodunun parametresine yollayacagın obje, respond'un body kısmını oluşturacaktır.
  res.send({
    name: 'Alperen',
    likes: [ 'Gomis', 'Garry']
  });
});

app.get('/galatasaray', (req, res) => {
  res.send('Galatasaray Page');
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

/* Response headers içerisindeki Content-Type değeri bizim yolladığımız res.send(); içerisindeki parametreye göre değişir.
res.send('<h1>Hello Express!</h1>'); yaparsak Content-Type:text/html; olur ve ona göre renderleme olur h1, h2, b gibi taglar başarılı renderlenir.
res.send({ name: 'Alperen', likes: [ 'Gomis', 'Garry']}); dersen eğer Content-Type:application/json; olur ve gönderilen obje otomatik olarak
json string'ine dönüştürülür.
*/

// Yukarıdaki 2 yönteme alternatif 3.yöntem express.js için bir view engine kullanmaktır.. .pug, .ejs .hbs  .. gibi
// npm install hbs --save yyapıyoruz.   hbs: Express.js view engine for handlebars.js
const hbs = require('hbs');
// app.set() methodu çeşitli express yapılandırmalarını ayarlamak için kullanılır..
// key: value; pair olarak çalışır birçok yapıladırma yapılabilir biz burada Express'e, view engine olarak hbs kullanacağımızı söyleyeceğiz.
app.set('view engine', 'hbs');    // hbs yazan yer  html de olablirdi pug da ejs de...
// views klasörü oluşturduk, views is the default directory that express uses for your templates.

// Alttaki about ve home sayfalarında ortak bulunan bazı yerleri "partial" olarak bir kere tanımlayıp birden fazla kez kullanacağız. (MVC :D )
hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('getCurrentYear', () => {  // birçok sayfada kullanılan şeyleri burada 1 kez tanımlayıp çok kez çagırabılırsın.
  return new Date().getFullYear();                  // footer.hbs dosyası içinde çağırdık..
}); // kullanılan değişken ilk olarak registerHelper içerisinde aranır, bulunamazsa res.render() methodu içinde aranır..! çok önemli!!
// projeyi çalıştırırken nodemon ya da node server.js -e js,hbs  (e demek extensions(eklenti,uzantı)) hbs eklentisini katarak çalıştırıyoruz ++
// ++ normal olarak da çalıstırınca saglıklı calıstı zaten pek anlasılmadı burası !

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();  // home.hbs içinde bu regiter'i kullandık.
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {         // views klasörü default olarak aranacak klasördür view için. o yüzden bu şekilde dosyayı algılıyor.
    pageTitle: 'About Page',
    pageDesc: 'This is about page that includes about my company and my engineers!'
  }); // render methodu bizim yukarıda yazdıgımız view engine: hbs; satırına göre kodu renderleyecektir. yani hbs olarak çevirecek.
});       // localhost:3000/about linkine gidersen sayfayı görebilirsin.

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    pageDesc: 'This is home page that includes some links, some sliders!',
    welcomeMessage: 'Welcome to my website'
  }); // render methodu bizim yukarıda yazdıgımız view engine: hbs; satırına göre kodu renderleyecektir. yani hbs olarak çevirecek.
});       // localhost:3000/about linkine gidersen sayfaı görebilirsin.


app.listen(3000, () => {   // bu objenin listen methodunu çağırarak 3000 no'lu portu dinleyerek çalıştığında ne olacağını da  ++
  console.log('Server is up on port 3000 (sunucu calisiyor)');                                                // ++ fonksiyon yazarak belirttik.
});

// Browser'da gordukten sonra sağtık incele'ye bas( developer tool) sonra Network kısmını aç tekrar sayfayı yenile ve orada yaptığın isteği (request)
//  göreceksin. ve detaylı bilgi içinde ona tıkla (Name yazan yer) açılan pencerede request ve response bilgilerini incele..

/* app.use içerisine yadıgımız middleware fonksiyonun tanımını şu şekilde yapabiliriz:
Any number of functions that are invoked by the Express.js routing layer before your final request handler is made. */
