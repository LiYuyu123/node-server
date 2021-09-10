import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import * as fs from 'fs';
import * as p from 'path';
import * as url from 'url';


const server = http.createServer();
const publicDir = p.resolve(__dirname, 'public');
let cacheAge=3600*24*365
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    const {url: path, method, headers} = request;
    const {pathname, search} = url.parse(path);
    // response.setHeader('Content-Type','text/html ; charset=utf-8')
     if(method!=='GET'){
      response.statusCode=405
         response.end('只支持get')
     }
    let fileName = pathname.substr(1);
    if (fileName === '') {
        fileName = 'index.html';
    }
    fs.readFile(p.resolve(publicDir, fileName), (error, data) => {
        if (error) {
            if (error.errno === -4058) {
                response.statusCode = 404;
                fs.readFile(p.resolve(publicDir,'404.html'),(error,data)=>{
                    response.end(data);
                })
            } else if(error.errno===-4068){
                response.statusCode=403
                response.end('无权限访问')
            }else {
                response.statusCode = 500;
                response.end('服务器内部错误');
            }
        } else {
            response.setHeader('Cache-Control',`public,max-age=${cacheAge}`) //缓存文件一年
            //返回文件内容
            response.end(data);
        }
    });


});
server.listen(8888);