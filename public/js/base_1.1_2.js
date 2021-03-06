// 怒ってくれるやつ
"use strict";

// c++ の pair 型的なものを用意する
function Pair(first, second){
    this.first = first;
    this.second = second;
}


// グローバル変数をここに宣言する (これって作法的にどうなの?)
let howindexed;     // 0-indexed : 0, 1-indexed: 1
let isweighted;     // unweighted: 0, weighted : 1
let isdirected;     // undirected: 0, directed : 1
let howformat;      // normal:     0, matrix   : 1


// ページ読み込み時に実行される関数 
$(document).ready( function(){
    // テキストエリアの placeholder にサンプルを表示させたい
    indexed1();
    unweighted();
    undirected();
    normal();
});


function indexed0(){
    let container = document.getElementById("preferenceIndex");
    container.innerText = "0-indexed";
    howindexed = 0;
    setPlaceHolder();
}

function indexed1(){
    let container = document.getElementById("preferenceIndex");
    container.innerText = "1-indexed";
    howindexed = 1;
    setPlaceHolder();
}

function unweighted(){
    let container = document.getElementById("preferenceWeight");
    isweighted = 0;
    container.innerText = "unweighted";
    setPlaceHolder();
}

function weighted(){
    let container = document.getElementById("preferenceWeight");
    isweighted = 1;
    container.innerText = "weighted";
    setPlaceHolder();
}

function undirected(){
    let container = document.getElementById("preferenceDirected");
    isdirected = 0;
    container.innerText = "undirected";
    setPlaceHolder();
}

function directed(){
    let container = document.getElementById("preferenceDirected");
    isdirected = 1;
    container.innerText = "directed";
    setPlaceHolder();
}

function normal(){
    let container = document.getElementById("preferenceFormat");
    howformat = 0;
    container.innerText = "normal";
    setPlaceHolder();
}

function matrix(){
    let container = document.getElementById("preferenceFormat");
    howformat = 1;
    container.innerText = "matrix";
    setPlaceHolder();
}

function setPlaceHolder(){

    let container = document.getElementById("input_area");
    
    // 0-indexed 重みなし無向グラフ
    if(!howindexed && !isweighted && !isdirected && !howformat) container.placeholder = "4 3\n0 1\n1 2\n2 3";
    if(!howindexed && !isweighted && !isdirected && howformat) container.placeholder = "4\n0 1 0 0\n1 0 1 0\n0 1 0 1\n0 0 1 0";
    
    // 0-indexed 重みなし有向グラフ
    if(!howindexed && !isweighted && isdirected && !howformat) container.placeholder = "4 3\n0 1\n1 2\n2 3";
    if(!howindexed && !isweighted && isdirected && howformat) container.placeholder = "4\n0 1 0 0\n0 0 1 0\n0 0 0 1\n0 0 0 0";
    
    // 0-indexed 重みあり無向グラフ
    if(!howindexed && isweighted && !isdirected && !howformat) container.placeholder = "4 3\n0 1 3\n1 2 2\n2 3 10";
    if(!howindexed && isweighted && !isdirected && howformat) container.placeholder = "4\n0 3 0 0\n3 0 2 0\n0 2 0 10\n0 0 10 0";
    
    // 0-indexed 重みあり有向グラフ
    if(!howindexed && isweighted && isdirected && !howformat) container.placeholder = "4 3\n0 1 3\n1 2 2\n2 3 10";
    if(!howindexed && isweighted && isdirected && howformat) container.placeholder = "4\n0 3 0 0\n0 0 2 0\n0 0 0 10\n0 0 0 0";
    

    // 1-indexed 重みなし無向グラフ
    if(howindexed && !isweighted && !isdirected && !howformat) container.placeholder = "4 3\n1 2\n2 3\n3 4";
    if(howindexed && !isweighted && !isdirected && howformat) container.placeholder = "4\n0 1 0 0\n1 0 1 0\n0 1 0 1\n0 0 1 0";
    
    // 1-indexed 重みなし有向グラフ
    if(howindexed && !isweighted && isdirected && !howformat) container.placeholder = "4 3\n1 2\n2 3\n3 4";
    if(howindexed && !isweighted && isdirected && howformat) container.placeholder = "4\n0 1 0 0\n0 0 1 0\n0 0 0 1\n0 0 0 0";
    
    // 1-indexed 重みあり無向グラフ
    if(howindexed && isweighted && !isdirected && !howformat) container.placeholder = "4 3\n1 2 3\n2 3 2\n3 4 10";
    if(howindexed && isweighted && !isdirected && howformat) container.placeholder = "4\n0 3 0 0\n3 0 2 0\n0 2 0 10\n0 0 10 0";
    
    // 1-indexed 重みあり有向グラフ
    if(howindexed && isweighted && isdirected && !howformat) container.placeholder = "4 3\n1 2 3\n2 3 2\n3 4 10";
    if(howindexed && isweighted && isdirected && howformat) container.placeholder = "4\n0 3 0 0\n0 0 2 0\n0 0 0 10\n0 0 0 0";
}


// 入力が妥当かどうかを判定する
function validator(str){
    
    // NaN が入っていたらだめ
    for(let i = 0; i < str.length; i++) if(isNaN(str[i])){

        console.log("129");
        message1();
        return;
    }; 
   

    if(howformat){  
        
        // 隣接行列

        let n = str[0];
        
        // 必要な数だけ入力があるかどうか
        if(n * n + 1 != str.length){
            console.log("139");
            message1();
            return;
        }
        // 重みなしの場合, 0 or 1 のみ許す
        if(!isweighted){
            for(let i = 1; i < str.length; i++){
                if(!(str[i] == 1 || str[i] == 0)){
                    console.log("145");
                    message1();
                    return;
                }
            }
        }

        // 無向グラフの場合, 対称行列のみを許す
        if(!isdirected){
            for(let i = 1; i <= n; i++){
                for(let j = 1; j <= n; j++){
                    let ii = j;
                    let jj = i;
                    let idx1 = (i - 1) * n + j;
                    let idx2 = (ii - 1) * n + jj;
                    if(str[idx1] != str[idx2]){
                        console.log("167");
                        message1();
                        return;
                    }
                }
            }
        }

    }else{

        // normal

        // 入力の長さは 2 以上が必要
        if(str.length < 2){ 
            console.log("161");
            message1();
            return;
        }
        let n = str[0];
        let m = str[1];

        // 必要な数だけ入力があるかどうか
        if(isweighted){
            if(3 * m + 2 != str.length){
                console.log(str.length);
                console.log("171");
                message1();
                return;
            }
        }else{
            if(2 * m + 2 != str.length){ 
                console.log("177");
                message1();
                return;
            }
        }
        
        // 存在しない頂点を指定したらダメ
        for(let i = 0; i < m; i++){
            let a;
            let b;
            if(isweighted){
                a = str[i * 3 + 2];
                b = str[i * 3 + 3];
            }else{
                a = str[i * 2 + 2];
                b = str[i * 2 + 3];
            }
            if(howindexed){
                a--;
                b--;
            }
            
            if(a < 0 || b < 0 || n <= a || n <= b){
                console.log("219");
                message1();
                return;
            }
        }
    }

    return;
}

function inputToGraph(){
    
    let nodeList = [];
    let edgeList = [];
    
    //let str = document.forms.id_mainForm.id_mainTextBox.value;
    // TODO この書き方では動かないの?
    let tmp = input_area;
    let str = tmp.value;
    

    /* hoge と入力したら, input_area に placeholder の値が出現 */
    if(str == ""){
        let container = document.getElementById("input_area");
        $("#input_area").val(container.placeholder);
        str = tmp.value;
    }

    // 改行文字と空白文字で分割
    
    str = str.split(/\s|\n/).map(x => parseFloat(x));
    validator(str);
    console.log(str);
    // 頂点数
    let V = str[0];
    // 辺数
    let E = str[1];

    // 隣接行列表現
    let adjList = new Array(V);
    for(let i = 0; i < V; i++) adjList[i] = new Array(0);
    
    
    if(howformat){
            
        // 入力が隣接行列
        for(let i = 0; i < V; i++){
            for(let j = 0; j < V; j++){
                let idx = i * V + j + 1;
                if(str[idx] == 0) continue;
                let a = i;
                let b = j;
                let c = str[idx];
                adjList[a].push(new Pair(b, c)); 
            }
        }
    }else{

        // 入力が normal 
        if(isweighted){
            // 重み付き

            for(let i = 0; i < E; i++){
                let a = str[i * 3 + 2];
                let b = str[i * 3 + 3];
                let c = str[i * 3 + 4];
                if(howindexed){ 
                    a--;
                    b--;
                }
                
                adjList[a].push(new Pair(b, c));
                if(!isdirected) adjList[b].push(new Pair(a, c));
            }
        }else{
            // 重みなし
            for(let i = 0; i < E; i++){
                let a = str[i * 2 + 2];
                let b = str[i * 2 + 3];
                let c = 1;
                if(howindexed){
                    a--;
                    b--;
                }

                adjList[a].push(new Pair(b, c));
                if(!isdirected) adjList[b].push(new Pair(a, c));
            }
        }


    }

    /* input to adjMatrix end */

    // 頂点情報を追加
    for(let i = 0; i < V; i++){
        let lab;
        if(howindexed){
            lab = String(i + 1);
            if(i + 1 < 10) lab = ' ' + lab + ' ';
        }else{
            lab = String(i);
            if(i < 10) lab = ' ' + lab + ' ';
        }

        nodeList.push({id: i, label: lab});
    }
    
    // 辺情報を追加
    for(let i = 0; i < V; i++){
        for(let j = 0; j < adjList[i].length; j++){
            let a = i;
            let b = adjList[i][j].first;
            let c = adjList[i][j].second;
            if(c == 0) continue;
            
            let arr;
            if(isdirected) arr = 'to';
            else{
                if(a > b) continue;
                arr = 'with';
            }
            if(isweighted) edgeList.push({from: a, to: b, label: String(c), arrows: arr});
            else edgeList.push({from: a, to: b, arrows: arr});
            
        }
    }

    let nodes = new vis.DataSet(nodeList);
    let edges = new vis.DataSet(edgeList);


    let container = document.getElementById('network');
    let data = {
        nodes,
        edges,
    };
    
    let options = {
        /*nodes:{
            shape:'circle',
        },*/
    };
    
    let network = new vis.Network(container, data, options);
}


function message0(){
    alert("このページでは何も起こりません.");
}

function message1(){
    alert("入力形式が間違っています.");
}
