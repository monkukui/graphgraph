// グローバル変数をここに宣言する (これって作法的にどうなの?)
var howindexed;     // 0-indexed : 0, 1-indexed: 1
var isweighted;     // unweighted: 0, weighted : 1
var isdirected;     // undirected: 0, directed : 1
var howformat;      // normal:     0, matrix   : 1


// ページ読み込み時に実行される関数 
$(document).ready( function(){
    // テキストエリアの placeholder にサンプルを表示させたい
    indexed1();
    unweighted();
    undirected();
    normal();
});


function indexed0(){
    var container = document.getElementById("preferenceIndex");
    container.innerText = "0-indexed";
    howindexed = 0;
    setPlaceHolder();
}

function indexed1(){
    var container = document.getElementById("preferenceIndex");
    container.innerText = "1-indexed";
    howindexed = 1;
    setPlaceHolder();
}

function unweighted(){
    var container = document.getElementById("preferenceWeight");
    isweighted = 0;
    container.innerText = "unweighted";
    setPlaceHolder();
}

function weighted(){
    var container = document.getElementById("preferenceWeight");
    isweighted = 1;
    container.innerText = "weighted";
    setPlaceHolder();
}

function undirected(){
    var container = document.getElementById("preferenceDirected");
    isdirected = 0;
    container.innerText = "undirected";
    setPlaceHolder();
}

function directed(){
    var container = document.getElementById("preferenceDirected");
    isdirected = 1;
    container.innerText = "directed";
    setPlaceHolder();
}

function normal(){
    var container = document.getElementById("preferenceFormat");
    howformat = 0;
    container.innerText = "normal";
    setPlaceHolder();
}

function matrix(){
    var container = document.getElementById("preferenceFormat");
    howformat = 1;
    container.innerText = "matrix";
    setPlaceHolder();
}

function setPlaceHolder(){

    var container = document.getElementById("input_area");
    
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
    
    var isvalid = true;
    // NaN が入っていたらだめ
    for(var i = 0; i < str.length; i++) if(isNaN(str[i])) isvalid = false; 
   

    if(howformat){  // 隣接行列
        
        var n = str[0];
        
        // 必要な数だけ入力があるかどうか
        if(n * n + 1 != str.length) isvalid = false;
        
        // 重みなしの場合, 0 or 1 のみ許す
        for(var i = 1; i < str.length; i++){
            if(!(str[i] = 0 || str[i] == 1)) isvalid = false;
        }

    }else{


    }
}

function inputToGraph(){
    
    var nodeList = [];
    var edgeList = [];
    
    //var str = document.forms.id_mainForm.id_mainTextBox.value;
    // TODO この書き方では動かないの?
    var tmp = input_area;
    var str = tmp.value;
    

    /* hoge と入力したら, input_area に placeholder の値が出現 */
    if(str == ""){
        var container = document.getElementById("input_area");
        $("#input_area").val(container.placeholder);
        str = tmp.value;
    }

    // 改行文字と空白文字で分割
    
    str = str.split(/\s|\n/).map(x => parseFloat(x));
    validator(str);
    // 頂点数
    var V = str[0];
    // 辺数
    var E = str[1];

    // 隣接行列表現
    var adjMatrix = new Array(V);
    for(var i = 0; i < V; i++) adjMatrix[i] = new Array(V);
    
    /* input to adjMatrix */

    // 0 で初期化
    for(var i = 0; i < V; i++){
        for(var j = 0; j < V; j++){
            adjMatrix[i][j] = 0;
        }
    }
    

    if(howformat){
        
        // 入力が隣接リスト表現
        for(var i = 0; i < V; i++){
            for(var j = 0; j < V; j++){
                var idx = i * V + j + 1;
                adjMatrix[i][j] = str[idx];
            }
        }
    }else{

        // 入力が normal 
        if(isweighted){
            // 重み付き
            for(var i = 0; i < E; i++){
                var a = str[i * 3 + 2];
                var b = str[i * 3 + 3];
                var c = str[i * 3 + 4];
                if(howindexed){ 
                    a--;
                    b--;
                }
                
                adjMatrix[a][b] = c;
                if(!isdirected) adjMatrix[b][a] = c;
            }
        }else{
            // 重みなし
            for(var i = 0; i < E; i++){
                var a = str[i * 2 + 2];
                var b = str[i * 2 + 3];
                if(howindexed){
                    a--;
                    b--;
                }
                adjMatrix[a][b] = 1;
                if(!isdirected) adjMatrix[b][a] = 1;
            }
        }
    }

    for(var i = 0; i < V; i++){
        console.log(adjMatrix[i]);
    }
    /* input to adjMatrix end */


    // 頂点情報を追加
    for(var i = 0; i < V; i++){
        var lab;
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
    for(var i = 0; i < V; i++){
        for(var j = 0; j < V; j++){
            var a = i;
            var b = j;
            var c = adjMatrix[i][j];
            if(c == 0) continue;
            
            var arr;
            if(isdirected) arr = 'to';
            else{
                if(i > j) continue;
                arr = 'with';
            }
            if(isweighted) edgeList.push({from: a, to: b, label: String(c), arrows: arr});
            else edgeList.push({from: a, to: b, arrows: arr});
            
        }
    }

    var nodes = new vis.DataSet(nodeList);
    var edges = new vis.DataSet(edgeList);


    var container = document.getElementById('network');
    var data = {
        nodes: nodes,
        edges: edges
    };
    
    var options = {
    };
    
    var network = new vis.Network(container, data, options);
}



function message0(){
    alert("このページでは何も起こりません.");
}
