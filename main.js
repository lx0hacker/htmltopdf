const puppeteer = require('puppeteer');
var program = require('commander');
function list (val) {
    return val.split(',')
}
program
    .version('0.0.1')
    .usage('[options] [value ...]')
    .option('-u, --url <string>', 'a string argument')
    .option('-n, --name <string>', 'a string argument')    
    .option('-l, --list <items>', 'a list', list)

program.on('help',()=>{
    console.log('   Example：');
    console.log('');
    console.log('       # input string for url and name');
    console.log('');
    console.log('       $ node main.js -u "https://www.baidu.com" -n "baidu" ');
    console.log('');
});

//解析commandline arguments
program.parse(process.argv);

if(program.url && program.name){
    (async ()=>{
        const browser = await puppeteer.launch({
            headless:true
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36')
        await page.goto(program.url,{timeout:0,waitUntil:"networkidle2"});
        const dimensions = await page.evaluate(()=>{
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
        });
        await page.pdf({path:'./reports/'+program.name+'.pdf',width:dimensions['width']+'px',height:dimensions['height']+'px'});
        await browser.close();
    })();
}


