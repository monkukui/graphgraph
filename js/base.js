// ページ読み込み時に実行される関数 
$(document).ready( function(){
    // テキストエリアの placeholder にサンプルを表示させたい
    $("#input_area").val("4 3\n1 2 1\n2 3 5\n3 4 10");
});


function indexed0(){
    alert("0-indexed");
}

function indexed1(){
    alert("1-indexed");
}

function unweighted(){
    alert("unweighted");
}

function weighted(){
    alert("weighted");
}

function directed(){
    alert("directed");
}

function undirected(){
    alert("undirected");
}

function normal(){
    alert("normal");
}

function matrix(){
    alert("matrix");
}

function inputToGraph(){
    
    var nodeList = [];
    var edgeList = [];
    
    //var str = document.forms.id_mainForm.id_mainTextBox.value;
    // TODO この書き方では動かないの?
    var tmp = input_area;
    var str = tmp.value;
    // 改行文字と空白文字で分割
    alert("hoge");
    if(str=="miryu") alert("I love Miryu");
    str = str.split(/\s|\n/).map(x => parseFloat(x));

    // 頂点数
    var V = str[0];
    // 辺数
    var E = str[1];
    // 頂点情報を追加
    for(var i = 0; i < V; i++){
        // 1 桁なら 空白埋め
        var lab = String(i + 1);
        if(i + 1 < 10) lab = ' ' + lab + ' ';
        nodeList.push({id: i + 1, label: lab});
    }

    // 辺情報を追加
    for(var i = 0; i < E; i++){
        var a = str[i * 3 + 2];
        var b = str[i * 3 + 3];
        var c = str[i * 3 + 4];
        edgeList.push({from: a, to: b, label: String(c), arrows: 'to'});
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
