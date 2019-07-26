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
      version: '1.2.3'
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
      <div id="footer"><small>Copyright (c) monkukui All Right Reserved.</small></div>
    </div>
  `,
})


Vue.component('graphgraph', {
  template: `
    <div id="graphgraph">
      <h5> 競技プログラミングにおけるグラフ問題の入力例を可視化するサイトです.</h5>
      <br>
      <div>
        <textarea v-model="inputText" rows="10" cols="60" placeholder="add multiple lines"></textarea>
      </div>

      <!-- input_area end -->

      <!-- 詳細設定 start -->
      <div class="preference">
          <div class="btn-group">
            <button v-if="indexed" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">1-indexed</button>
            <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">0-indexed</button>
            <div class="dropdown-menu">
                <button class="dropdown-item" type="button" v-on:click="indexed = false;"> 0-indexed </button>
                <button class="dropdown-item" type="button" v-on:click="indexed = true;"> 1-indexed </button>
            </div>
          </div>
          
          <div class="btn-group">
            <button v-if="directed" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">directed</button>
            <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">undirected</button>
            <div class="dropdown-menu">
                <button class="dropdown-item" type="button" v-on:click="directed = false;"> undirected </button>
                <button class="dropdown-item" type="button" v-on:click="directed = true;"> directed </button>
            </div>
          </div>
      
          <div class="btn-group">
            <button v-if="weighted" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">weighted</button>
            <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">unweighted</button>
            <div class="dropdown-menu">
                <button class="dropdown-item" type="button" v-on:click="weighted = false;"> unweighted </button>
                <button class="dropdown-item" type="button" v-on:click="weighted = true;"> weighted </button>
            </div>
          </div>

          <div class="btn-group">
            <button v-if="format" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">normal</button>
            <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">matrix</button>
            <div class="dropdown-menu">
                <button class="dropdown-item" type="button" v-on:click="format = false;"> matrix </button>
                <button class="dropdown-item" type="button" v-on:click="format = true;"> normal </button>
            </div>
          </div>
      
          <button type="button" class="btn btn-primary" id="importButton" v-on:click="execute">IMPORT</button>
      </div>
      <!-- 詳細設定 end -->
      <br>
      <br>

      <div v-if="!valid">
        <div class=\"alert alert-danger\" role="alert">
          <h4 class="alert-heading">入力形式が正しくありません!</h4>
          <p> message: {{ errorMessage }} </p>
          <hr>
          <p class="mb-0"> 詳しくは <a href="howtouse.html" class="alert-link"> 使い方 </a> をご覧ください.</p>
        </div>
      </div>

      <div id="network"></div>
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
      placeHolder: "hogehoge",
      V: 0,              // num of vertex
      E: 0,              // num of edge
      adjList: [],
      
      // vis.js で使うもの
      nodeList: [],
      edgeList: [],
    
      // 入力の妥当性判定に使う
      valid: true,
      errorMessage: ""
    }

  },

  methods: {
    
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
      
      console.log(this.inputText);
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
          if(c == 0) continue;

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
        /*

        */
      };

      let network = new vis.Network(container, data, options);

    },
    execute: function() {
      this.readInput();
      this.setVis();
      this.visualize();
    }
  },
})

new Vue({
  el: '#app'
})
