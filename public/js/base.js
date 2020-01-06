function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


// c++ の pair 型的なものを用意する　
function Pair(first, second){
  this.first = first;
  this.second = second;
}



// navigation-bar
// home 使い方 このページについて　とかのやつ
Vue.component('navbar', {
  props: {
    pagename: {
      type: String,
      required: true,
      default: "index"
    }
  },

  template: `
    <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark navbar-fixed-top">
    <!--img :src="image" alt="logo" width="64" height="64" -->
    <a class="navbar-brand" href="index.html"> <span style="margin-right: 1em;"></span> <font size="5">GRAPH × GRAPH</font></a>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
      <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
        
        <div>
          <li v-if="isIndex" class="nav-item active">
            <a class="nav-link" href="index.html">ホーム <span class="sr-only">(current)</span></a>
          </li>
          <li v-else class="nav-item">
            <a class="nav-link" href="index.html">ホーム</a>
          </li>
        </div>

        <div>
          <li v-if="isHowtouse" class="nav-item active">
            <a class="nav-link" href="howtouse.html">使い方<span class="sr-only">(current)</span></a>
          </li>
          <li v-else class="nav-item">
            <a class="nav-link" href="howtouse.html">使い方</a>
          </li>
        </div>
        
        <div>
          <li v-if="isAbout" class="nav-item active">
            <a class="nav-link" href="about.html">このページについて<span class="sr-only">(current)</span></a>
          </li>
          <li v-else class="nav-item">
            <a class="nav-link" href="about.html">このページについて</a>
          </li>
        </div>
      </ul>
    </div>
    </nav>
  `,

  data: function() {
    return {
      logoname: 'logo5',
    }
  },

  computed: {
    image() {
      return 'images/' + this.logoname + '.png'
    },

    isIndex() {
      return this.pagename == 'index'
    },

    isHowtouse() {
      return this.pagename == 'howtouse'
    },

    isAbout() {
      return this.pagename == 'about'
    }
  }
})

Vue.component('top', {
  template: ` 
  <div id="top">
    <div id="logo"><img :src="image" alt="logo" width="260" height="160"></div>
    <div id="hoge"> ver.{{ version }}</div> 
    <div class="dropdown-divider"></div>
  </div>
  `,
  data: function() {
    return {
      logoname: 'logo8',
      version: '2.2.1'
    }
  },

  computed: {
    image() {
      return 'images/' + this.logoname + '.png'
    }
  }
})

Vue.component('foot', {
  template: `
    <div id="foot">
      <div class="dropdown-divider"></div>
      <div id="footer" align="center"><small>Copyright (c) monkukui All Right Reserved.</small></div>
    </div>
  `,
})


Vue.component('graphgraph', {
  template: `
    <div id="graphgraph">
    <br>
      <h5> 競技プログラミングにおけるグラフ問題の入力例を可視化するサイトです.</h5>
      <br>
      <br>
      <div class="container-fluid">
        <div class="row">
          <div class="col">
            <textarea id="input_area" v-model="inputText" rows="21" cols="25" placeholder=""></textarea>
          </div>
          <div class="col">
            <div id="network"></div>
            <div class="smooth">
              <div class="space">
                <div class="card" style="width: 10rem; position: relative; left: -5rem;">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    辺を滑らかに <input type="checkbox" v-model="isSmooth" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br>
      <div v-if="!valid">
        <div class=\"alert alert-danger\" role="alert">
          <h4 class="alert-heading">入力形式が正しくありません!</h4>
          <p> message: {{ errorMessage }} </p>
          <hr>
          <p class="mb-0"> 詳しくは <a href="howtouse.html" class="alert-link"> 使い方 </a> をご覧ください.</p>
        </div>
      </div>
      <div class="container-fluid">
        <div class="row">
          <div class="space">
            <div class="btn-group">
              <button v-if="indexed" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">1-indexed</button>
              <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">0-indexed</button>
              <div class="dropdown-menu">
                  <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(-1, -1, -1, false)"> 0-indexed </button>
                  <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(-1, -1, -1, true)"> 1-indexed </button>
              </div>
            </div>
          </div>
          <div class="space">
            <div class="btn-group">
              <button v-if="directed" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">directed</button>
              <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">undirected</button>
              <div class="dropdown-menu">
                  <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(-1, false, -1, -1)"> undirected </button>
                  <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(-1, true, -1, -1)"> directed </button>
              </div>
            </div>
          </div>
          <div class="space">
            <div class="btn-group">
              <button v-if="weighted" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">weighted</button>
              <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">unweighted</button>
              <div class="dropdown-menu">
                  <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(-1, -1, false, -1)"> unweighted </button>
                  <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(-1, -1, true, -1)"> weighted </button>
              </div>
            </div>
          </div>
          <div class="space">
            <div class="btn-group">
              <button v-if="format" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">normal</button>
              <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">matrix</button>
              <div class="dropdown-menu">
                  <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(false, -1, -1, -1)"> matrix </button>
                  <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(true, -1, -1, -1)"> normal </button>
              </div>
            </div>
          </div>
          <div class="space">
            <button type="button" class="btn btn-outline-primary" id="importButton" v-on:click="execute">VISUALIZE!!</button>
          </div>
        </div>
      </div>
      <br>


    </div>
  `,

  data: function() {
    return {
      // 不明瞭だけど、こうするしかなかったんです...
      format: true,      // true := normal, false := matrix
      directed: false,   // true := directed, false := undirected
      weighted: false,   // true := weighted, false := undirected
      indexed: true,     // true := 1-indexed, false := 0-indexed
      
      inputText: "",
      placeHolder:  "4 3\n1 2\n2 3\n3 4",
      V: 0,              // num of vertex
      E: 0,              // num of edge
      adjList: [],
      
      // vis.js で使うもの
      nodeList: [],
      edgeList: [],
    
      // 入力の妥当性判定に使う
      valid: true,
      errorMessage: "",

      // 辺を滑らかにするか
      isSmooth: false,

    }

  },

  methods: {
    
    setPlaceHolder: function(format, directed, weighted, indexed) {
      
      if(format != -1) this.format = format;
      if(weighted != -1) this.weighted = weighted;
      if(directed != -1) this.directed = directed;
      if(indexed != -1) this.indexed = indexed;

      let container = document.getElementById("input_area");
      
      // 0-indexed 重みなし無向グラフ
      if(!this.indexed && !this.weighted && !this.directed && this.format) container.placeholder = "4 3\n0 1\n1 2\n2 3";
      if(!this.indexed && !this.weighted && !this.directed && !this.format) container.placeholder = "4\n0 1 0 0\n1 0 1 0\n0 1 0 1\n0 0 1 0";
      
      // 0-indexed 重みなし有向グラフ
      if(!this.indexed && !this.weighted && this.directed && this.format) container.placeholder = "4 3\n0 1\n1 2\n2 3";
      if(!this.indexed && !this.weighted && this.directed && !this.format) container.placeholder = "4\n0 1 0 0\n0 0 1 0\n0 0 0 1\n0 0 0 0";
      
      // 0-indexed 重みあり無向グラフ
      if(!this.indexed && this.weighted && !this.directed && this.format) container.placeholder = "4 3\n0 1 3\n1 2 2\n2 3 10";
      if(!this.indexed && this.weighted && !this.directed && !this.format) container.placeholder = "4\n0 3 0 0\n3 0 2 0\n0 2 0 10\n0 0 10 0";
      
      // 0-indexed 重みあり有向グラフ
      if(!this.indexed && this.weighted && this.directed && this.format) container.placeholder = "4 3\n0 1 3\n1 2 2\n2 3 10";
      if(!this.indexed && this.weighted && this.directed && !this.format) container.placeholder = "4\n0 3 0 0\n0 0 2 0\n0 0 0 10\n0 0 0 0";
      

      // 1-indexed 重みなし無向グラフ
      if(this.indexed && !this.weighted && !this.directed && this.format) container.placeholder = "4 3\n1 2\n2 3\n3 4";
      if(this.indexed && !this.weighted && !this.directed && !this.format) container.placeholder = "4\n0 1 0 0\n1 0 1 0\n0 1 0 1\n0 0 1 0";
      
      // 1-indexed 重みなし有向グラフ
      if(this.indexed && !this.weighted && this.directed && this.format) container.placeholder = "4 3\n1 2\n2 3\n3 4";
      if(this.indexed && !this.weighted && this.directed && !this.format) container.placeholder = "4\n0 1 0 0\n0 0 1 0\n0 0 0 1\n0 0 0 0";
      
      // 1-indexed 重みあり無向グラフ
      if(this.indexed && this.weighted && !this.directed && this.format) container.placeholder = "4 3\n1 2 3\n2 3 2\n3 4 10";
      if(this.indexed && this.weighted && !this.directed && !this.format) container.placeholder = "4\n0 3 0 0\n3 0 2 0\n0 2 0 10\n0 0 10 0";
      
      // 1-indexed 重みあり有向グラフ
      if(this.indexed && this.weighted && this.directed && this.format) container.placeholder = "4 3\n1 2 3\n2 3 2\n3 4 10";
      if(this.indexed && this.weighted && this.directed && !this.format) container.placeholder = "4\n0 3 0 0\n0 0 2 0\n0 0 0 10\n0 0 0 0";
      
      
      this.placeHolder = container.placeholder;
    },

    validator: function(arr) {
      this.valid = true;
      
      // NaN が入ってたらダメ
      for(let i = 0; i < arr.length; i++){
        if(isNaN(arr[i])){
          this.errorMessage = "入力に予期せぬ値が含まれています.";
          this.valid = false;
        }
      }

      if(!this.format){
        
        // 隣接行列
        let n = arr[0];

        // 必要な数だけ入力があるかどうか
        if(n * n + 1 < arr.length){
          this.errorMessage = "入力が多すぎます.";
          this.valid = false;
        }

        if(n * n + 1 > arr.length){
          this.errorMessage = "入力が足りていません.";
          this.valid = false;
        }

        // 重みなしの場合, 0 or 1 のみを許す
        if(!this.weighted){
          for(let i = 1; i < arr.length; i++){
            if(!(arr[i] == 0 || arr[i] == 1)){
              this.errorMessage = "「辺がある: 1,  辺がない: 0」 と入力してください.";
              this.valid = false;
            }
          }
        }

        // 無向グラフの場合, 対称行列のみを許す
        if(!this.directed){
          for(let i = 1; i <= n; i++){
            for(let j = 1; j <= n; j++){
              let ii = j;
              let jj = i;
              let idx1 = (i - 1) * n + j;
              let idx2 = (ii - 1) * n + jj;
              if(arr[idx1] != arr[idx2]){
                this.errorMessage = "無向グラフを扱う場合, 対称行列を入力してください."
                this.valid = false;
              }
            }
          }
        }
      }else{
        
        // AtCoder 形式
        
        // 入力の長さは 2 以上が必要
        if(arr.length < 2){
          this.errorMessage = "入力が足りていません.";
          this.valid = false;
        }

        let n = arr[0];
        let m = arr[1];

        // 必要な数だけ入力があるかどうか
        if(this.weighted){
          if(3 * m + 2 > arr.length){
            this.errorMessage = "入力が足りていません.";
            this.valid = false;
          }
          if(3 * m + 2 < arr.length){
            this.errorMessage = "入力が多すぎます.";
            this.valid = false;
          }
        }else{
          if(2 * m + 2 > arr.length){
            this.errorMessage = "入力が足りていません.";
            this.valid = false;
          }
          if(2 * m + 2 < arr.length){
            this.errorMessage = "入力が多すぎます.";
            this.valid = false;
          }
        }
        
        // 存在しない頂点を指定したらダメ
        for(let i = 0; i < m; i++){
          let a;
          let b;
          if(this.weighted){
            a = arr[i * 3 + 2];
            b = arr[i * 3 + 3];
          }else{
            a = arr[i * 2 + 2];
            b = arr[i * 2 + 3];
          }

          if(this.indexed){
            a--;
            b--;
          }

          if(a < 0 || b < 0 || n <= a || n <= b){
            this.errorMessage = "存在しない頂点を指定しています";
            this.valid = false;
          }
        }
      }
    },

    // 入力を読み込んで, V, E, adjList にセットする
    readInput: function() {
      
      if(this.inputText == ""){
        this.inputText = this.placeHolder;
      }
      
      // 改行文字と空白文字で分解
      let arr = this.inputText.split(/\s|\n/).filter(n => n !== "").map(n => parseFloat(n));
      
      // 妥当性判定
      this.validator(arr);
      if(!this.valid) return;

      this.V = arr[0];
      this.E = arr[1];
      this.adjList = new Array(this.V);
      for(let i = 0; i < this.V; i++) this.adjList[i] = new Array(0);
      
      if(!this.format){
        // 隣接行列
        for(let i = 0; i < this.V; i++){
          for(let j = 0; j < this.V; j++){
            let idx = i * this.V + j + 1;
            if(arr[idx] == 0) continue;
            let a = i;
            let b = j;
            let c = arr[idx];
            this.adjList[a].push(new Pair(b, c));
          }
        }
      }else{
        // AtCoder 形式
        if(this.weighted){
          // 重み付き
          for(let i = 0; i < this.E; i++){
            let a = arr[i * 3 + 2];
            let b = arr[i * 3 + 3];
            let c = arr[i * 3 + 4];
            if(this.indexed){
              a--;
              b--;
            }

            this.adjList[a].push(new Pair(b, c));
            if(!this.directed) this.adjList[b].push(new Pair(a, c));
          }
        }else{
          // 重みなし
          for(let i = 0; i < this.E; i++){
            let a = arr[i * 2 + 2];
            let b = arr[i * 2 + 3];
            let c = 1;
            if(this.indexed){
              a--;
              b--;
            }

            this.adjList[a].push(new Pair(b, c));
            if(!this.directed) this.adjList[b].push(new Pair(a, c));
          }
        }
      }
    },
    // adjList から を visの情報に変換 
    setVis: function() {
      
      // 初期化
      this.nodeList = [];
      this.edgeList = [];

      // 頂点情報を追加
      for(let i = 0; i < this.V; i++){
        let lab;
        if(this.indexed){
          lab = String(i + 1);
          if(i + 1 < 10) lab = ' ' + lab + ' ';
        }else{
          lab = String(i);
          if(i < 10) lab = ' ' + lab + ' ';
        }

        this.nodeList.push({id: i, label: lab});
      }

      // 辺情報を追加
      for(let i = 0; i < this.V; i++){
        for(let j = 0; j < this.adjList[i].length; j++){
          let a = i;
          let b = this.adjList[i][j].first;
          let c = this.adjList[i][j].second;

          let type;
          if(this.directed) type = 'to';
          else{
            if(a > b) continue;
            type = 'with';
          }
          
          if(this.weighted) this.edgeList.push({from: a, to: b, label: String(c), arrows: type});
          else this.edgeList.push({from: a, to: b, arrows: type});
        }
      }
    },
    visualize: function() {
      let nodes = new vis.DataSet(this.nodeList);
      let edges = new vis.DataSet(this.edgeList);
      
      let container = document.getElementById('network');
      let data = {
        nodes,
        edges,
      };
      let options = {
          edges: {
            smooth: this.isSmooth,
          }
      };

      let network = new vis.Network(container, data, options);

    },
    execute: function() {
      this.readInput();
      this.setVis();
      this.visualize();
    },
    changeIsSmooth: function() {
      if(this.isSmooth == false) this.isSmooth = true;
      else                       this.isSmooth = false;
    },
  },

  mounted: function() {
    let param = location.search;
    if(param == ""){
      let container = document.getElementById("input_area");
      container.placeholder = "4 3\n1 2\n2 3\n3 4";
    }else{
      let paramFormat = getParam('format');
      let paramIndexed = getParam('indexed');
      let paramWeighted = getParam('weighted');
      let paramDirected = getParam('directed');
      let paramData = getParam('data');
      this.setPlaceHolder(paramFormat=='true', paramDirected=='true', paramWeighted=='true', paramIndexed=='true');
      paramData = paramData.replace(/-/g, ' ');
      paramData = paramData.replace(/,/g, '\n');
      this.inputText = paramData;
      this.execute();
    } 
  }
})


Vue.component('about', {
  template: `
  <div id="graphgraph">
    <br>
    <h2>推奨ブラウザ</h2>
    <p>以下のブラウザ環境を推奨します.</p> 
    <ul>
      <li v-for="browser in good_browsers">{{ browser }}</li>
    </ul>
    <h2> 非推奨ブラウザ</h2>
    <p>以下のブラウザ環境は推奨しません.</p> 
    <ul>
      <li v-for="browser in bad_browsers">{{ browser }}</li>
    </ul>

    <h2>作った人</h2>
    <p>monkukui (<a href="https://twitter.com/monkukui2" target="_blank">@monkukui2</a>)が作りました.</a>
    <p> サイトの作成に協力してくださった全ての人達に, この場を借りて謝辞を述べさせていただきます.</p>

    <h2>使用したもの</h2>
    <p>以下の技術を使用しました.</p>
    <ul>
      <li v-for="tech in techs"> {{ tech }}</li>
    </ul>

  </div>
  `,
  data: function() {
    return {
      good_browsers: [
        "Google Chrome", 
        "Firefox"
      ],
      bad_browsers: [
        "Safari", 
        "Internet Explorer"
      ],
      techs: [
        "Firebase",
        "vis.js (グラフ描画ライブラリ)",
        "Bootstrap (デザイン)",
        "vue.js (フレームワーク)"
      ]
    }
  },
})

Vue.component('ExplainButton', {
  template: ` 
  <div>
    <p>
      <div class="btn-group">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="preferenceIndex" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> 1-indexed </button>
      <div class="dropdown-menu" aria-labelledby="preferenceIndex">
        <button class="dropdown-item" type="button" v-on:click="message"> 0-indexed </button>
        <button class="dropdown-item" type="button" v-on:click="message"> 1-indexed </button>
      </div>
      </div>
      では, 頂点にラベルづけされる整数が, 0 から始まるか 1 から始まるかを選択します. 
    </p>
      
    <p>
      <div class="btn-group">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="preferenceDirected" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> undirected </button>
      <div class="dropdown-menu" aria-labelledby="preferenceDirected">
        <button class="dropdown-item" type="button" v-on:click="message"> undirected </button>
        <button class="dropdown-item" type="button" v-on:click="message"> directed </button>
      </div>
      </div>
      では, 有向グラフを扱うか無向グラフを扱うかを選択します.
    </p>

    <p>
      <div class="btn-group">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="preferenceWeight" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> unweighted </button>
      <div class="dropdown-menu" aria-labelledby="preferenceWeight">
        <button class="dropdown-item" type="button" v-on:click="message"> unweighted </button>
        <button class="dropdown-item" type="button" v-on:click="message"> weighted </button>
      </div>
      </div>
      では, 辺に重みをつけるかつけないかを選択します. 
    </p>
      
    <p>
      <div class="btn-group">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="preferenceFormat" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> normal </button>
      <div class="dropdown-menu" aria-labelledby="preferenceFormat">
        <button class="dropdown-item" type="button" v-on:click="message"> normal </button>
        <button class="dropdown-item" type="button" v-on:click="message"> matrix </button>
      </div>
      </div>
      では, 入力を normal 形式で与えるか matrix 形式で与えるかを選択します. 
    </p>
      
    <p> 最後に
      <button type="button" class="btn btn-outline-primary" v-on:click="message">IMPORT</button>
      を押すと, 入力が読み込まれグラフが出力されます.
    </p>
  </div>
  `,
  methods: {
    message: function() {
      alert("このページでは何も起こりません.");
    }
  }
})

// 怒涛のカード 16 連撃
Vue.component('Card0000', {
  // ok
  template: `
    <div class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重みなし無向グラフ</h4></div>
        <hr>
        <p class="card-text">
          <math><mi>n</mi></math><br>
          <math><msub><mi>a</mi><mrow><mn>1</mn><mn>1</mn></mrow></msub></math>&ctdot;<math><msub><mi>a</mi><mrow><mn>1</mn><mi>n</mi></mrow></msub></math><br>
          &vellip;<br>
          <math><msub><mi>a</mi><mrow><mi>n</mi><mn>1</mn></mrow></msub></math>&ctdot;<math><msub><mi>a</mi><mrow><mi>n</mi><mi>n</mi></mrow></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数を表す 1 つの整数 <math><mi>n</mi></math>&nbsp;を与える.</p>
        <p>2 行目から続く <math><mi>m</mi></math> 行は隣接行列 <math><mi>A</mi></math> &nbsp;を表し,<br>
        各行では <math><mi>n</mi></math> つの整数を空白区切で与える.</p>
        <p><math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></math> &isin; {<mn>0</mn>,<mn>1</mn>} が要求され,<br>
        <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mn>1</mn></math> の時は, 頂点 <math><mi>i</mi><mo>-</mo><mn>1</mn></math>,&nbsp;<math><mi>j</mi><mo>-</mo><mn>1</mn></math> を双方向につなぐ辺が存在することを表し,<br>
        <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mn>0</mn></math> の時は, 頂点 <math><mi>i</mi><mo>-</mo><mn>1</mn></math>,&nbsp;<math><mi>j</mi><mo>-</mo><mn>1</mn></math> 間に辺が存在しないことを表す.</p>
        <p> また <math><mi>A</mi></math> は対称行列であることを要求する.<br>つまり, 全ての <math><mi>i</mi></math>, <math><mi>j</mi></math> に対して, <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><msub><mi>a</mi><mrow><mi>j</mi><mi>i</mi></mrow></msub></math> を満たすことを要求する.</p>
      </div>
    </div>
  `
})


Vue.component('Card0001', {
  template: `
    <div class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重みなし無向グラフ</h4></div>
        <hr>
        <p class="card-text">
          <math><mi>n</mi></math><br>
          <math><msub><mi>a</mi><mrow><mn>1</mn><mn>1</mn></mrow></msub></math>&ctdot;<math><msub><mi>a</mi><mrow><mn>1</mn><mi>n</mi></mrow></msub></math><br>
          &vellip;<br>
          <math><msub><mi>a</mi><mrow><mi>n</mi><mn>1</mn></mrow></msub></math>&ctdot;<math><msub><mi>a</mi><mrow><mi>n</mi><mi>n</mi></mrow></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数を表す 1 つの整数 <math><mi>n</mi></math>&nbsp;を与える.</p>
        <p>2 行目から続く <math><mi>m</mi></math> 行は隣接行列 <math><mi>A</mi></math> &nbsp;を表し,<br>
        各行では <math><mi>n</mi></math> つの整数を空白区切で与える.</p>
        <p><math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></math> &isin; {<mn>0</mn>,<mn>1</mn>} が要求され,<br>
        <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mn>1</mn></math> の時は, 頂点 <math><mi>i</mi></math>,&nbsp;<math><mi>j</mi></math> を双方向につなぐ辺が存在することを表し,<br>
        <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mn>0</mn></math> の時は, 頂点 <math><mi>i</mi></math>,&nbsp;<math><mi>j</mi></math> 間に辺が存在しないことを表す.</p>
        <p> また <math><mi>A</mi></math> は対称行列であることを要求する.<br>つまり, 全ての <math><mi>i</mi></math>, <math><mi>j</mi></math> に対して, <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><msub><mi>a</mi><mrow><mi>j</mi><mi>i</mi></mrow></msub></math> を満たすことを要求する.</p>
      </div>
    </div>
  `
})


Vue.component('Card0010', {
  template: `
    <div class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重みなし有向グラフ</h4></div>
        <hr>
        <p class="card-text">
          <math><mi>n</mi></math><br>
          <math><msub><mi>a</mi><mrow><mn>1</mn><mn>1</mn></mrow></msub></math> &ctdot;<math><msub><mi>a</mi><mrow><mn>1</mn><mi>n</mi></mrow></msub></math><br>
          &vellip;<br>
          <math><msub><mi>a</mi><mrow><mi>n</mi><mn>1</mn></mrow></msub></math> &ctdot;<math><msub><mi>a</mi><mrow><mi>n</mi><mi>n</mi></mrow></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数を表す 1 つの整数 <math><mi>n</mi></math>&nbsp;を与える.</p>
        <p>2 行目から続く <math><mi>m</mi></math> 行は隣接行列 <math><mi>A</mi></math> &nbsp;を表し,<br>
        各行では <math><mi>n</mi></math> つの整数を空白区切で与える.</p>
        <p><math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></math> &isin; {<mn>0</mn>,<mn>1</mn>} が要求され,<br>
        <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mn>1</mn></math> の時は, 頂点 <math><mi>i</mi><mo>-</mo><mn>1</mn></math> から <math><mi>j</mi><mo>-</mo><mn>1</mn></math> へ向かう辺が存在することを表し,<br>
        <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mn>0</mn></math> の時は, 頂点 <math><mi>i</mi><mo>-</mo><mn>1</mn></math> から <math><mi>j</mi><mo>-</mo><mn>1</mn></math> へ向かう辺が存在しないことを表す.</p>
      </div>
    </div>
  `
})

Vue.component('Card0011', {
  template: `
    <div class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重みなし有向グラフ</h4></div>
        <hr>
        <p class="card-text">
          <math><mi>n</mi></math><br>
          <math><msub><mi>a</mi><mrow><mn>1</mn><mn>1</mn></mrow></msub></math> &ctdot;<math><msub><mi>a</mi><mrow><mn>1</mn><mi>n</mi></mrow></msub></math><br>
          &vellip;<br>
          <math><msub><mi>a</mi><mrow><mi>n</mi><mn>1</mn></mrow></msub></math> &ctdot;<math><msub><mi>a</mi><mrow><mi>n</mi><mi>n</mi></mrow></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数を表す 1 つの整数 <math><mi>n</mi></math>&nbsp;を与える.</p>
        <p>2 行目から続く <math><mi>m</mi></math> 行は隣接行列 <math><mi>A</mi></math> &nbsp;を表し,<br>
        各行では <math><mi>n</mi></math> つの整数を空白区切で与える.</p>
        <p><math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></math> &isin; {<mn>0</mn>,<mn>1</mn>} が要求され,<br>
        <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mn>1</mn></math> の時は, 頂点 <math><mi>i</mi></math> から頂点 <math><mi>j</mi></math> に向かう辺が存在することを表し,<br>
        <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mn>0</mn></math> の時は, 頂点 <math><mi>i</mi></math> から頂点 <math><mi>j</mi></math> に向かう辺がないことを表す.</p>
      </div>
    </div>
  `
})

Vue.component('Card0100', {
  template: `
    <div class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重みあり無向グラフ</h4></div>
        <hr>
        <p class="card-text">
          <math><mi>n</mi></math><br>
          <math><msub><mi>a</mi><mrow><mn>1</mn><mn>1</mn></mrow></msub></math> &ctdot;<math><msub><mi>a</mi><mrow><mn>1</mn><mi>n</mi></mrow></msub></math><br>
          &vellip;<br>
          <math><msub><mi>a</mi><mrow><mi>n</mi><mn>1</mn></mrow></msub></math> &ctdot;<math><msub><mi>a</mi><mrow><mi>n</mi><mi>n</mi></mrow></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数を表す 1 つの整数 <math><mi>n</mi></math>&nbsp;を与える.</p>
        <p>2 行目から続く <math><mi>m</mi></math> 行は隣接行列 <math><mi>A</mi></math> &nbsp;を表し,<br>
        各行では <math><mi>n</mi></math> つの整数を空白区切で与える.</p>
        <p><math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></math> &ge; <math><mn>1</mn></math> の時は, 頂点 <math><mi>i</mi><mo>-</mo><mn>1</mn></math>, <math><mi>j</mi><mo>-</mo><mn>1</mn></math> を双方向につなぐ<br>重み <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></math> の辺が存在することを表し,<br>
        <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mn>0</mn></math> の時は, 頂点 <math><mi>i</mi></math>, <math><mi>j</mi></math> 間に辺が存在しないことを表す.</p>
        
        <p> また <math><mi>A</mi></math> は対称行列であることを要求する.<br>つまり, 全ての <math><mi>i</mi></math>, <math><mi>j</mi></math> に対して, <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><msub><mi>a</mi><mrow><mi>j</mi><mi>i</mi></mrow></msub></math> を満たすことを要求する.</p>
      </div>
    </div>
  `
})

Vue.component('Card0101', {
  template: `
    <div class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重みあり無向グラフ</h4></div>
        <hr>
        <p class="card-text">
          <math><mi>n</mi></math><br>
          <math><msub><mi>a</mi><mrow><mn>1</mn><mn>1</mn></mrow></msub></math> &ctdot;<math><msub><mi>a</mi><mrow><mn>1</mn><mi>n</mi></mrow></msub></math><br>
          &vellip;<br>
          <math><msub><mi>a</mi><mrow><mi>n</mi><mn>1</mn></mrow></msub></math> &ctdot;<math><msub><mi>a</mi><mrow><mi>n</mi><mi>n</mi></mrow></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数を表す 1 つの整数 <math><mi>n</mi></math>&nbsp;を与える.</p>
        <p>2 行目から続く <math><mi>m</mi></math> 行は隣接行列 <math><mi>A</mi></math> &nbsp;を表し,<br>
        各行では <math><mi>n</mi></math> つの整数を空白区切で与える.</p>
        <p><math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></math> &ge; <math><mn>1</mn></math> の時は, 頂点 <math><mi>i</mi></math>, <math><mi>j</mi></math> を双方向につなぐ<br>重み <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></math> の辺が存在することを表し,<br>
        <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mn>0</mn></math> の時は, 頂点 <math><mi>i</mi></math>, <math><mi>j</mi></math> 間に辺が存在しないことを表す.</p>
      
        <p> また <math><mi>A</mi></math> は対称行列であることを要求する.<br>つまり, 全ての <math><mi>i</mi></math>, <math><mi>j</mi></math> に対して, <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><msub><mi>a</mi><mrow><mi>j</mi><mi>i</mi></mrow></msub></math> を満たすことを要求する.</p>
      </div>
    </div>
  `
})


Vue.component('Card0110', {
  template: `
    <div class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重みあり有向グラフ</h4></div>
        <hr>
        <p class="card-text">
          <math><mi>n</mi></math><br>
          <math><msub><mi>a</mi><mrow><mn>1</mn><mn>1</mn></mrow></msub></math> &ctdot;<math><msub><mi>a</mi><mrow><mn>1</mn><mi>n</mi></mrow></msub></math><br>
          &vellip;<br>
          <math><msub><mi>a</mi><mrow><mi>n</mi><mn>1</mn></mrow></msub></math> &ctdot;<math><msub><mi>a</mi><mrow><mi>n</mi><mi>n</mi></mrow></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数を表す 1 つの整数 <math><mi>n</mi></math>&nbsp;を与える.</p>
        <p>2 行目から続く <math><mi>m</mi></math> 行は隣接行列 <math><mi>A</mi></math> &nbsp;を表し,<br>
        各行では <math><mi>n</mi></math> つの整数を空白区切で与える.</p>
        <p><math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></math> &ge; <math><mn>1</mn></math> の時は, 頂点 <math><mi>i</mi><mo>-</mo><mn>1</mn></math> から <math><mi>j</mi><mo>-</mo><mn>1</mn></math> へ向かう, <br>重み <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></math> の辺が存在することを表し,<br>
        <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mn>0</mn></math> の時は, 頂点 <math><mi>i</mi></math> から <math><mi>j</mi></math> へ向かう辺が存在しないことを表す.</p>
      </div>
    </div>
  `
})

Vue.component('Card0111', {
  template: `
    <div class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重みあり有向グラフ</h4></div>
        <hr>
        <p class="card-text">
          <math><mi>n</mi></math><br>
          <math><msub><mi>a</mi><mrow><mn>1</mn><mn>1</mn></mrow></msub></math> &ctdot;<math><msub><mi>a</mi><mrow><mn>1</mn><mi>n</mi></mrow></msub></math><br>
          &vellip;<br>
          <math><msub><mi>a</mi><mrow><mi>n</mi><mn>1</mn></mrow></msub></math> &ctdot;<math><msub><mi>a</mi><mrow><mi>n</mi><mi>n</mi></mrow></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数を表す 1 つの整数 <math><mi>n</mi></math>&nbsp;を与える.</p>
        <p>2 行目から続く <math><mi>m</mi></math> 行は隣接行列 <math><mi>A</mi></math> &nbsp;を表し,<br>
        各行では <math><mi>n</mi></math> つの整数を空白区切で与える.</p>
        <p><math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></math> &ge; <math><mn>1</mn></math> の時は, 頂点 <math><mi>i</mi></math> から <math><mi>j</mi></math> へ向かう,<br>重み <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub></math> の辺が存在することを表し,<br>
        <math><msub><mi>a</mi><mrow><mi>i</mi><mi>j</mi></mrow></msub><mo>=</mo><mn>0</mn></math> の時は, 頂点 <math><mi>i</mi></math> から <math><mi>j</mi></math> へ向かう辺が存在しないことを表す.</p>
      </div>
    </div>
  `
})


Vue.component('Card1000', {
  template: `
    <div id="card" class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重みなし無向グラフ</h4></div>
        <hr>
        <p class="card-text">
          
          <math><mi>n</mi></math>&nbsp;<math><mi>m</mi></math><br>
          <math><msub><mi>a</mi><mn>1</mn></msub></math>&nbsp;<math><msub><mi>b</mi><mn>1</mn></msub></math><br>
          &#8942;<br>
          <math><msub><mi>a</mi><mi>m</mi></msub></math>&nbsp;<math><msub><mi>b</mi><mi>m</mi></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数と辺数を表す 2 つの整数 <math><mi>n</mi></math>,&nbsp;<math><mi>m</mi></math>&nbsp;を空白区切で与える.</p>
        <p> 2 行目から続く <math><mi>m</mi></math> 行のうち <math><mi>i</mi></math> 行目においては, <br>
          <math><mi>i</mi></math> 番目の辺を表す 2 つの整数 <math><msub><mi>a</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>b</mi><mi>i</mi></msub></math> を空白区切で与える.</p>
        <p>これは, 頂点 <math><msub><mi>a</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>b</mi><mi>i</mi></msub></math> を双方向につなぐ辺が存在することを表し, <br>
        <math><mn>0</mn></math> &le; <math><msub><mi>a</mi><mi>i</mi></msub></math>, <math><msub><mi>b</mi><mi>i</mi></msub></math> &le; <math><mi>n</mi><mo>-</mo><mn>1</mn></math> を満たすことが要求される.</p>
      </div>
    </div>
  `
})

Vue.component('Card1001', {
  template: `
    <div id="card" class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重みなし無向グラフ</h4></div>
        <hr>
        <p class="card-text">
          
          <math><mi>n</mi></math>&nbsp;<math><mi>m</mi></math><br>
          <math><msub><mi>a</mi><mn>1</mn></msub></math>&nbsp;<math><msub><mi>b</mi><mn>1</mn></msub></math><br>
          &#8942;<br>
          <math><msub><mi>a</mi><mi>m</mi></msub></math>&nbsp;<math><msub><mi>b</mi><mi>m</mi></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数と辺数を表す 2 つの整数 <math><mi>n</mi></math>,&nbsp;<math><mi>m</mi></math>&nbsp;を空白区切で与える.</p>
        <p> 2 行目から続く <math><mi>m</mi></math> 行のうち <math><mi>i</mi></math> 行目においては, <br>
          <math><mi>i</mi></math> 番目の辺を表す 2 つの整数 <math><msub><mi>a</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>b</mi><mi>i</mi></msub></math> を空白区切で与える.</p>
        <p>これは, 頂点 <math><msub><mi>a</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>b</mi><mi>i</mi></msub></math> を双方向につなぐ辺が存在することを表し, <br>
        <math><mn>1</mn></math> &le; <math><msub><mi>a</mi><mi>i</mi></msub></math>, <math><msub><mi>b</mi><mi>i</mi></msub></math> &le; <math><mi>n</mi></math> を満たすことが要求される.</p>
      </div>
    </div>
  `
})

Vue.component('Card1010', {
  template: `
    <div id="card" class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重みなし有向グラフ</h4></div>
        <hr>
        <p class="card-text">
          
          <math><mi>n</mi></math>&nbsp;<math><mi>m</mi></math><br>
          <math><msub><mi>a</mi><mn>1</mn></msub></math>&nbsp;<math><msub><mi>b</mi><mn>1</mn></msub></math><br>
          &#8942;<br>
          <math><msub><mi>a</mi><mi>m</mi></msub></math>&nbsp;<math><msub><mi>b</mi><mi>m</mi></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数と辺数を表す 2 つの整数 <math><mi>n</mi></math>,&nbsp;<math><mi>m</mi></math>&nbsp;を空白区切で与える.</p>
        <p> 2 行目から続く <math><mi>m</mi></math> 行のうち <math><mi>i</mi></math> 行目においては, <br>
          <math><mi>i</mi></math> 番目の辺を表す 2 つの整数 <math><msub><mi>a</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>b</mi><mi>i</mi></msub></math> を空白区切で与える.</p>
        <p>これは, 頂点 <math><msub><mi>a</mi><mi>i</mi></msub></math> から <math><msub><mi>b</mi><mi>i</mi></msub></math> へ向かう辺が存在することを表し, <br>
        <math><mn>0</mn></math> &le; <math><msub><mi>a</mi><mi>i</mi></msub></math>, <math><msub><mi>b</mi><mi>i</mi></msub></math> &le; <math><mi>n</mi><mo>-</mo><mn>1</mn></math> を満たすことが要求される.</p>
      </div>
    </div>
  `
})

Vue.component('Card1011', {
  template: `
    <div id="card" class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重みなし有向グラフ</h4></div>
        <hr>
        <p class="card-text">
          
          <math><mi>n</mi></math>&nbsp;<math><mi>m</mi></math><br>
          <math><msub><mi>a</mi><mn>1</mn></msub></math>&nbsp;<math><msub><mi>b</mi><mn>1</mn></msub></math><br>
          &#8942;<br>
          <math><msub><mi>a</mi><mi>m</mi></msub></math>&nbsp;<math><msub><mi>b</mi><mi>m</mi></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数と辺数を表す 2 つの整数 <math><mi>n</mi></math>,&nbsp;<math><mi>m</mi></math>&nbsp;を空白区切で与える.</p>
        <p> 2 行目から続く <math><mi>m</mi></math> 行のうち <math><mi>i</mi></math> 行目においては, <br>
          <math><mi>i</mi></math> 番目の辺を表す 2 つの整数 <math><msub><mi>a</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>b</mi><mi>i</mi></msub></math> を空白区切で与える.</p>
        <p>これは, 頂点 <math><msub><mi>a</mi><mi>i</mi></msub></math> から <math><msub><mi>b</mi><mi>i</mi></msub></math> へ向かう辺が存在することを表し, <br>
        <math><mn>1</mn></math> &le; <math><msub><mi>a</mi><mi>i</mi></msub></math>, <math><msub><mi>b</mi><mi>i</mi></msub></math> &le; <math><mi>n</mi></math> を満たすことが要求される.</p>
      </div>
    </div>
  `
})

Vue.component('Card1100', {
  template: `
    <div id="card" class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重み付き無向グラフ</h4></div>
        <hr>
        <p class="card-text">
          
          <math><mi>n</mi></math>&nbsp;<math><mi>m</mi></math><br>
          <math><msub><mi>a</mi><mn>1</mn></msub></math>&nbsp;<math><msub><mi>b</mi><mn>1</mn></msub></math>&nbsp;<math><msub><mi>c</mi><mn>1</mn></msub></math><br>
          &#8942;<br>
          <math><msub><mi>a</mi><mi>m</mi></msub></math>&nbsp;<math><msub><mi>b</mi><mi>m</mi></msub></math>&nbsp;<math><msub><mi>c</mi><mi>m</mi></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数と辺数を表す 2 つの整数 <math><mi>n</mi></math>,&nbsp;<math><mi>m</mi></math>&nbsp;を空白区切で与える.</p>
        <p> 2 行目から続く <math><mi>m</mi></math> 行のうち <math><mi>i</mi></math> 行目においては, <br>
          <math><mi>i</mi></math> 番目の辺を表す 3 つの整数 <math><msub><mi>a</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>b</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>c</mi><mi>i</mi></msub></math> を空白区切で与える.</p>
        <p>これは, 頂点 <math><msub><mi>a</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>b</mi><mi>i</mi></msub></math> を双方向につなぐ, 重み <math><msub><mi>c</mi><mi>i</mi></math> の辺が存在することを表し, <br>
        <math><mn>0</mn></math> &le; <math><msub><mi>a</mi><mi>i</mi></msub></math>, <math><msub><mi>b</mi><mi>i</mi></msub></math> &le; <math><mi>n</mi><mo>-</mo><mn>1</mn></math> を満たすことが要求される.</p>
      </div>
    </div>
  `
})

Vue.component('Card1101', {
  template: `
    <div id="card" class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重み付き無向グラフ</h4></div>
        <hr>
        <p class="card-text">
          
          <math><mi>n</mi></math>&nbsp;<math><mi>m</mi></math><br>
          <math><msub><mi>a</mi><mn>1</mn></msub></math>&nbsp;<math><msub><mi>b</mi><mn>1</mn></msub></math>&nbsp;<math><msub><mi>c</mi><mn>1</mn></msub></math><br>
          &#8942;<br>
          <math><msub><mi>a</mi><mi>m</mi></msub></math>&nbsp;<math><msub><mi>b</mi><mi>m</mi></msub></math>&nbsp;<math><msub><mi>c</mi><mi>m</mi></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数と辺数を表す 2 つの整数 <math><mi>n</mi></math>,&nbsp;<math><mi>m</mi></math>&nbsp;を空白区切で与える.</p>
        <p> 2 行目から続く <math><mi>m</mi></math> 行のうち <math><mi>i</mi></math> 行目においては, <br>
          <math><mi>i</mi></math> 番目の辺を表す 3 つの整数 <math><msub><mi>a</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>b</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>c</mi><mi>i</mi></msub></math> を空白区切で与える.</p>
        <p>これは, 頂点 <math><msub><mi>a</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>b</mi><mi>i</mi></msub></math> を双方向につなぐ, 重み <math><msub><mi>c</mi><mi>i</mi></math> の辺が存在することを表し, <br>
        <math><mn>1</mn></math> &le; <math><msub><mi>a</mi><mi>i</mi></msub></math>, <math><msub><mi>b</mi><mi>i</mi></msub></math> &le; <math><mi>n</mi></math> を満たすことが要求される.</p>
      </div>
    </div>
  `
})

Vue.component('Card1110', {
  template: `
    <div id="card" class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重み付き有向グラフ</h4></div>
        <hr>
        <p class="card-text">
          
          <math><mi>n</mi></math>&nbsp;<math><mi>m</mi></math><br>
          <math><msub><mi>a</mi><mn>1</mn></msub></math>&nbsp;<math><msub><mi>b</mi><mn>1</mn></msub></math>&nbsp;<math><msub><mi>c</mi><mn>1</mn></msub></math><br>
          &#8942;<br>
          <math><msub><mi>a</mi><mi>m</mi></msub></math>&nbsp;<math><msub><mi>b</mi><mi>m</mi></msub></math>&nbsp;<math><msub><mi>c</mi><mi>m</mi></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数と辺数を表す 2 つの整数 <math><mi>n</mi></math>,&nbsp;<math><mi>m</mi></math>&nbsp;を空白区切で与える.</p>
        <p> 2 行目から続く <math><mi>m</mi></math> 行のうち <math><mi>i</mi></math> 行目においては, <br>
          <math><mi>i</mi></math> 番目の辺を表す 3 つの整数 <math><msub><mi>a</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>b</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>c</mi><mi>i</mi></msub></math> を空白区切で与える.</p>
        <p>これは, 頂点 <math><msub><mi>a</mi><mi>i</mi></msub></math> から <math><msub><mi>b</mi><mi>i</mi></msub></math> へ向かう, 重み <math><msub><mi>c</mi><mi>i</mi></math> の辺が存在することを表し, <br>
        <math><mn>0</mn></math> &le; <math><msub><mi>a</mi><mi>i</mi></msub></math>, <math><msub><mi>b</mi><mi>i</mi></msub></math> &le; <math><mi>n</mi><mo>-</mo><mn>1</mn></math> を満たすことが要求される.</p>
      </div>
    </div>
  `
})

Vue.component('Card1111', {
  template: `
    <div id="card" class="col-md-32" style=" position: relative; left: 50px;">
      <div class="card-body">
        <div class="card-text"><h4>重み付き有向グラフ</h4></div>
        <hr>
        <p class="card-text">
          
          <math><mi>n</mi></math>&nbsp;<math><mi>m</mi></math><br>
          <math><msub><mi>a</mi><mn>1</mn></msub></math>&nbsp;<math><msub><mi>b</mi><mn>1</mn></msub></math>&nbsp;<math><msub><mi>c</mi><mn>1</mn></msub></math><br>
          &#8942;<br>
          <math><msub><mi>a</mi><mi>m</mi></msub></math>&nbsp;<math><msub><mi>b</mi><mi>m</mi></msub></math>&nbsp;<math><msub><mi>c</mi><mi>m</mi></msub></math><br>
        </p>
        <hr>
        <p class="card-text">1 行目に頂点数と辺数を表す 2 つの整数 <math><mi>n</mi></math>,&nbsp;<math><mi>m</mi></math>&nbsp;を空白区切で与える.</p>
        <p> 2 行目から続く <math><mi>m</mi></math> 行のうち <math><mi>i</mi></math> 行目においては, <br>
          <math><mi>i</mi></math> 番目の辺を表す 3 つの整数 <math><msub><mi>a</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>b</mi><mi>i</mi></msub></math>,&nbsp;<math><msub><mi>c</mi><mi>i</mi></msub></math> を空白区切で与える.</p>
        <p>これは, 頂点 <math><msub><mi>a</mi><mi>i</mi></msub></math> から <math><msub><mi>b</mi><mi>i</mi></msub></math> へ向かう, 重み <math><msub><mi>c</mi><mi>i</mi></math> の辺が存在することを表し, <br>
        <math><mn>1</mn></math> &le; <math><msub><mi>a</mi><mi>i</mi></msub></math>, <math><msub><mi>b</mi><mi>i</mi></msub></math> &le; <math><mi>n</mi></math> を満たすことが要求される.</p>
      </div>
    </div>
  `
})



Vue.component('formatCard', {
  template: ` 
  <div>
    <p>以下のボタンの属性を変化させると, 入力形式を確認できます.</p>
    <div class="btn-group">
      <button v-if="lazyIndexed" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">1-indexed</button>
      <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">0-indexed</button>
      <div class="dropdown-menu">
          <button class="dropdown-item" type="button" v-on:click="lazyIndexed = false;"> 0-indexed </button>
          <button class="dropdown-item" type="button" v-on:click="lazyIndexed = true;"> 1-indexed </button>
      </div>
    </div>
    
    <div class="btn-group">
      <button v-if="lazyDirected" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">directed</button>
      <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">undirected</button>
      <div class="dropdown-menu">
          <button class="dropdown-item" type="button" v-on:click="lazyDirected = false;"> undirected </button>
          <button class="dropdown-item" type="button" v-on:click="lazyDirected = true;"> directed </button>
      </div>
    </div>

    <div class="btn-group">
      <button v-if="lazyWeighted" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">weighted</button>
      <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">unweighted</button>
      <div class="dropdown-menu">
          <button class="dropdown-item" type="button" v-on:click="lazyWeighted = false;"> unweighted </button>
          <button class="dropdown-item" type="button" v-on:click="lazyWeighted = true;"> weighted </button>
      </div>
    </div>

    <div class="btn-group">
      <button v-if="lazyFormat" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">normal</button>
      <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">matrix</button>
      <div class="dropdown-menu">
          <button class="dropdown-item" type="button" v-on:click="lazyFormat = false;"> matrix </button>
          <button class="dropdown-item" type="button" v-on:click="lazyFormat = true;"> normal </button>
      </div>
    </div>

    <button type="button" class="btn btn-outline-info" v-on:click="execute" v-on:mouseleave="turnFlag">入力形式を表示</button>
    <br>
    <br>
    <div class="card mb-5" style="max-width: 1040px; max-height: 1000px;">
      <div class="row no-gutters">
        <div class="col-md-4">
          <div id="network" style="width: 370px; height: 468px; border: 0px; background: rgb(150, 150, 150);"></div>
        </div>
        <div v-if="canDisplay">
          <div v-if="!format && !weighted && !directed && !indexed"> <Card0000></Card0000> </div>
          <div v-if="!format && !weighted && !directed && indexed"> <Card0001></Card0001> </div>
          <div v-if="!format && !weighted && directed && !indexed"> <Card0010></Card0010> </div>
          <div v-if="!format && !weighted && directed && indexed"> <Card0011></Card0011> </div>
          
          <div v-if="!format && weighted && !directed && !indexed"> <Card0100></Card0100> </div>
          <div v-if="!format && weighted && !directed && indexed"> <Card0101></Card0101> </div>
          <div v-if="!format && weighted && directed && !indexed"> <Card0110></Card0110> </div>
          <div v-if="!format && weighted && directed && indexed"> <Card0111></Card0111> </div>
          
          <div v-if="format && !weighted && !directed && !indexed"> <Card1000></Card1000> </div>
          <div v-if="format && !weighted && !directed && indexed"> <Card1001></Card1001> </div>
          <div v-if="format && !weighted && directed && !indexed"> <Card1010></Card1010> </div>
          <div v-if="format && !weighted && directed && indexed"> <Card1011></Card1011> </div>
          
          <div v-if="format && weighted && !directed && !indexed"> <Card1100></Card1100> </div>
          <div v-if="format && weighted && !directed && indexed"> <Card1101></Card1101> </div>
          <div v-if="format && weighted && directed && !indexed"> <Card1110></Card1110> </div>
          <div v-if="format && weighted && directed && indexed"> <Card1111></Card1111> </div>
        </div>
      </div>
    </div>
    

  </div>
  `,
  data: function() {
    return {
      lazyFormat: true,
      lazyWeighted: false,
      lazyDirected: false,
      lazyIndexed: true,
      
      mathFlag: false,
      format: true,
      weighted: false,
      directed: false,
      indexed: true,
      canDisplay: false
    }
  },
  methods: {
    turnFlag: function() {
      this.mathFlag = true;
    },
    execute: function() {

      MathJax.Hub.Typeset();
      this.mathFlag = false;
      this.format = this.lazyFormat;
      this.weighted = this.lazyWeighted;
      this.directed = this.lazyDirected;
      this.indexed = this.lazyIndexed;
  
      this.canDisplay = true;
      let edges;
      let nodes;
      if(this.indexed){
        nodes = new vis.DataSet([
          {id: 0, label: ' 1 '},
          {id: 1, label: ' 2 '},
          {id: 2, label: ' 3 '},
          {id: 3, label: ' 4 '}
        ]);
      }else{
        nodes = new vis.DataSet([
          {id: 0, label: ' 0 '},
          {id: 1, label: ' 1 '},
          {id: 2, label: ' 2 '},
          {id: 3, label: ' 3 '}
        ]);
      }

      
      if(!this.weighted){
        
        let arr;
        if(this.directed) arr = 'to';
        else arr = 'with';
        edges = new vis.DataSet([
          {from: 0, to: 1, arrows: arr},
          {from: 1, to: 2, arrows: arr},
          {from: 2, to: 3, arrows: arr},
          {from: 3, to: 1, arrows: arr},
        ]);
      }

      if(this.weighted){
        
        let arr;
        if(this.directed) arr = 'to';
        else arr = 'with';
        edges = new vis.DataSet([
          {from: 0, to: 1, label: String(3), arrows: arr},
          {from: 1, to: 2, label: String(2), arrows: arr},
          {from: 2, to: 3, label: String(5), arrows: arr},
          {from: 3, to: 1, label: String(8), arrows: arr},
        ]);
      }
      console.log(nodes.length);

      let data = {
        nodes,
        edges,
      };
      let options = {
        nodes: {
          color: 'white'
        },
        edges: {
          smooth: false
        }
      };
      let container = document.getElementById('network');
      let network = new vis.Network(container, data, options);
      
    }
  },
  watch: {
    mathFlag: function() {
      MathJax.Hub.Typeset();
    },
  }
})


Vue.component('howto', {
  template: ` 
  <div id="graphgraph">
    <!--h2> ボタンの説明 </h2-->
    <!--ExplainButton></ExplainButton-->
    <br>
    <h2> 入力形式 </h2>

    <formatCard></formatCard>
  </div>
  `,
  data: function() {
    return {
    }
  },
})


new Vue({
  el: '#app'
  
})
