// ── B-Tree Visualizer ─────────────────────────────────
// 隠しページ: B木の操作をアニメーション付きで可視化する

// ── 多言語対応 ───────────────────────────────────────
const appState = Vue.observable({ lang: localStorage.getItem('lang') || 'ja' });

function updateMeta(lang) {
  var m = translations[lang].meta;
  document.title = m.title;
  document.documentElement.lang = lang;
  var desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', m.description);
}

const translations = {
  ja: {
    meta: {
      title: 'B木 ビジュアライザ — GRAPH × GRAPH',
      description: 'B木の検索操作をアニメーションで可視化するツール',
    },
    nav: { home: 'ホーム', howToUse: '使い方', about: 'このページについて', articles: 'AtCoder 解説' },
    footer: { privacy: 'プライバシーポリシー', contact: 'お問い合わせ' },
    btree: {
      title: 'B木 ビジュアライザ',
      subtitle: '検索操作をアニメーションで可視化します',
      treeType: '木の種類',
      order: '次数 (m)',
      randomGen: 'ランダム生成',
      keyCount: 'キー数',
      search: '検索',
      value: '値',
      execute: '実行',
      speed: '速度',
      slow: '遅い',
      fast: '速い',
      log: '操作ログ',
      clear: 'クリア',
      clearTree: '木をクリア',
      found: '見つかりました',
      notFound: '見つかりませんでした',
      empty: '木が空です',
      animating: 'アニメーション中...',
    },
  },
  en: {
    meta: {
      title: 'B-Tree Visualizer — GRAPH × GRAPH',
      description: 'Visualize B-Tree search operations with animation',
    },
    nav: { home: 'Home', howToUse: 'How to Use', about: 'About', articles: 'AtCoder Articles' },
    footer: { privacy: 'Privacy Policy', contact: 'Contact' },
    btree: {
      title: 'B-Tree Visualizer',
      subtitle: 'Visualize search operations with animation',
      treeType: 'Tree Type',
      order: 'Order (m)',
      randomGen: 'Random Generate',
      keyCount: 'Keys',
      search: 'Search',
      value: 'Value',
      execute: 'Execute',
      speed: 'Speed',
      slow: 'Slow',
      fast: 'Fast',
      log: 'Operation Log',
      clear: 'Clear',
      clearTree: 'Clear Tree',
      found: 'Found',
      notFound: 'Not found',
      empty: 'Tree is empty',
      animating: 'Animating...',
    },
  },
};

updateMeta(appState.lang);

Vue.mixin({
  computed: {
    $tl() { return translations[appState.lang]; },
    $lang() { return appState.lang; },
  },
  methods: {
    $setLang(lang) {
      appState.lang = lang;
      localStorage.setItem('lang', lang);
      updateMeta(lang);
    },
  },
});

// ── 共通コンポーネント (base.js と同じ構造) ──────────────────

Vue.component('navbar', {
  props: {
    pagename: { type: String, required: true, default: 'index' }
  },
  template: `
    <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark navbar-fixed-top">
    <a class="navbar-brand" href="/index.html"> <span style="margin-right: 1em;"></span> <font size="5">GRAPH × GRAPH</font></a>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
      <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
        <div>
          <li class="nav-item">
            <a class="nav-link" href="/index.html">{{ $tl.nav.home }}</a>
          </li>
        </div>
        <div>
          <li class="nav-item">
            <a class="nav-link" href="/howtouse.html">{{ $tl.nav.howToUse }}</a>
          </li>
        </div>
        <div>
          <li class="nav-item">
            <a class="nav-link" href="/about.html">{{ $tl.nav.about }}</a>
          </li>
        </div>
        <div>
          <li class="nav-item">
            <a class="nav-link" href="/articles.html">{{ $tl.nav.articles }}</a>
          </li>
        </div>
      </ul>
      <div class="lang-toggle">
        <button class="btn-lang" :class="{'btn-lang-active': $lang === 'ja'}" @click="$setLang('ja')">JA</button>
        <button class="btn-lang" :class="{'btn-lang-active': $lang === 'en'}" @click="$setLang('en')">EN</button>
      </div>
    </div>
    </nav>
  `,
});

Vue.component('top', {
  template: `
  <div id="top">
    <div id="logo"><img :src="image" alt="logo" width="160" height="98"></div>
    <div id="hoge">ver.3.0.0</div>
    <div class="dropdown-divider" style="width:100%; margin-top: 16px;"></div>
  </div>
  `,
  data: function () {
    return { logoname: 'logo8' }
  },
  computed: {
    image() { return 'images/' + this.logoname + '.png' }
  }
});

Vue.component('foot', {
  template: `
    <div id="foot">
      <div class="dropdown-divider"></div>
      <div class="footer-links" align="center">
        <a href="/privacy.html">{{ $tl.footer.privacy }}</a>
        <span class="footer-sep">|</span>
        <a href="/contact.html">{{ $tl.footer.contact }}</a>
      </div>
      <div id="footer" align="center"><small>Copyright (c) monkukui All Right Reserved.</small></div>
    </div>
  `,
});


// ── B-Tree データ構造 ─────────────────────────────────

class BTreeNode {
  constructor(isLeaf) {
    this.keys = [];
    this.children = [];
    this.isLeaf = isLeaf !== false;
    this.id = BTreeNode._nextId++;
  }
}
BTreeNode._nextId = 0;

class BTree {
  constructor(order) {
    this.order = order;         // m: 各ノードの最大子ノード数
    this.maxKeys = order - 1;   // ノードが持てる最大キー数
    this.root = null;
  }

  // キーが既に存在するか検索（アニメーション用ステップ付き）
  search(value) {
    var steps = [];
    var node = this.root;

    while (node !== null) {
      steps.push({ type: 'visit', nodeId: node.id });

      var i = 0;
      while (i < node.keys.length && value > node.keys[i]) {
        i++;
      }

      if (i < node.keys.length && value === node.keys[i]) {
        steps.push({ type: 'found', nodeId: node.id, keyIndex: i });
        return { steps: steps, found: true };
      }

      if (node.isLeaf) {
        return { steps: steps, found: false };
      }

      node = node.children[i];
    }

    return { steps: steps, found: false };
  }

  // 挿入（ランダム生成用 — UIからは呼ばない）
  insert(value) {
    if (this.root === null) {
      this.root = new BTreeNode(true);
      this.root.keys.push(value);
      return;
    }

    // リーフまで下降し経路を記録
    var path = [];
    var node = this.root;
    while (!node.isLeaf) {
      var i = 0;
      while (i < node.keys.length && value > node.keys[i]) { i++; }
      path.push({ node: node, childIndex: i });
      node = node.children[i];
    }

    // リーフにキーを挿入
    var pos = 0;
    while (pos < node.keys.length && value > node.keys[pos]) { pos++; }
    node.keys.splice(pos, 0, value);

    // オーバーフローしたノードをボトムアップで分割
    while (node.keys.length > this.maxKeys) {
      var mid = Math.floor(node.keys.length / 2);
      var midKey = node.keys[mid];

      var newRight = new BTreeNode(node.isLeaf);
      newRight.keys = node.keys.slice(mid + 1);
      if (!node.isLeaf) {
        newRight.children = node.children.slice(mid + 1);
      }
      node.keys = node.keys.slice(0, mid);
      if (!node.isLeaf) {
        node.children = node.children.slice(0, mid + 1);
      }

      if (path.length === 0) {
        var newRoot = new BTreeNode(false);
        newRoot.keys = [midKey];
        newRoot.children = [node, newRight];
        this.root = newRoot;
        break;
      }

      var parentInfo = path.pop();
      parentInfo.node.keys.splice(parentInfo.childIndex, 0, midKey);
      parentInfo.node.children.splice(parentInfo.childIndex + 1, 0, newRight);
      node = parentInfo.node;
    }
  }

  // vis.js 用のデータに変換
  toVisData() {
    var nodes = [];
    var edges = [];

    if (this.root === null) return { nodes: nodes, edges: edges };

    var queue = [{ node: this.root, level: 0 }];
    while (queue.length > 0) {
      var item = queue.shift();
      var node = item.node;
      var level = item.level;

      nodes.push({
        id: node.id,
        label: node.keys.join(' | '),
        level: level,
        color: { background: '#7986cb', border: '#3949ab' },
        font: { color: '#ffffff', size: 14, face: 'monospace' },
        shape: 'box',
        margin: { top: 8, bottom: 8, left: 12, right: 12 },
        borderWidth: 2,
      });

      for (var c = 0; c < node.children.length; c++) {
        edges.push({
          from: node.id,
          to: node.children[c].id,
          arrows: 'to',
          color: { color: '#9e9e9e' },
        });
        queue.push({ node: node.children[c], level: level + 1 });
      }
    }

    return { nodes: nodes, edges: edges };
  }

  // ランダム B木を生成
  static generateRandom(n, order) {
    var btree = new BTree(order);
    BTreeNode._nextId = 0;
    var values = new Set();
    while (values.size < n) {
      values.add(Math.floor(Math.random() * 100) + 1);
    }
    for (var v of values) {
      btree.insert(v);
    }
    return btree;
  }

  // キー数をカウント
  size() {
    var count = 0;
    var stack = [this.root];
    while (stack.length > 0) {
      var node = stack.pop();
      if (node === null) continue;
      count += node.keys.length;
      for (var c = 0; c < node.children.length; c++) {
        stack.push(node.children[c]);
      }
    }
    return count;
  }
}


// ── B+Tree データ構造 ────────────────────────────────

class BPlusTreeNode {
  constructor(isLeaf) {
    this.keys = [];
    this.children = [];
    this.isLeaf = isLeaf !== false;
    this.next = null;  // リーフ間リンク
    this.id = BPlusTreeNode._nextId++;
  }
}
BPlusTreeNode._nextId = 0;

class BPlusTree {
  constructor(order) {
    this.order = order;
    this.maxKeys = order - 1;
    this.root = null;
  }

  // 検索（常にリーフまで下降 — アニメーション用ステップ付き）
  search(value) {
    var steps = [];
    var node = this.root;

    while (node !== null) {
      steps.push({ type: 'visit', nodeId: node.id });

      var i = 0;
      while (i < node.keys.length && value > node.keys[i]) {
        i++;
      }

      if (node.isLeaf) {
        if (i < node.keys.length && value === node.keys[i]) {
          steps.push({ type: 'found', nodeId: node.id, keyIndex: i });
          return { steps: steps, found: true };
        }
        return { steps: steps, found: false };
      }

      // 内部ノード: キーが一致しても下降を続ける
      if (i < node.keys.length && value === node.keys[i]) {
        i++;
      }
      node = node.children[i];
    }

    return { steps: steps, found: false };
  }

  // 挿入（ランダム生成用）
  insert(value) {
    if (this.root === null) {
      this.root = new BPlusTreeNode(true);
      this.root.keys.push(value);
      return;
    }

    // リーフまで下降し経路を記録
    var path = [];
    var node = this.root;
    while (!node.isLeaf) {
      var i = 0;
      while (i < node.keys.length && value > node.keys[i]) { i++; }
      if (i < node.keys.length && value === node.keys[i]) { i++; }
      path.push({ node: node, childIndex: i });
      node = node.children[i];
    }

    // リーフにキーを挿入
    var pos = 0;
    while (pos < node.keys.length && value > node.keys[pos]) { pos++; }
    node.keys.splice(pos, 0, value);

    // オーバーフローしたノードをボトムアップで分割
    while (node.keys.length > this.maxKeys) {
      var mid = Math.floor(node.keys.length / 2);
      var midKey = node.keys[mid];

      var newRight = new BPlusTreeNode(node.isLeaf);

      if (node.isLeaf) {
        // リーフ分割: 中間キーをコピー（リーフにも残す）
        newRight.keys = node.keys.slice(mid);
        node.keys = node.keys.slice(0, mid);
        // リーフ間リンクを維持
        newRight.next = node.next;
        node.next = newRight;
      } else {
        // 内部ノード分割: B木と同じ（中間キーを移動）
        newRight.keys = node.keys.slice(mid + 1);
        newRight.children = node.children.slice(mid + 1);
        node.keys = node.keys.slice(0, mid);
        node.children = node.children.slice(0, mid + 1);
      }

      if (path.length === 0) {
        var newRoot = new BPlusTreeNode(false);
        newRoot.keys = [midKey];
        newRoot.children = [node, newRight];
        this.root = newRoot;
        break;
      }

      var parentInfo = path.pop();
      parentInfo.node.keys.splice(parentInfo.childIndex, 0, midKey);
      parentInfo.node.children.splice(parentInfo.childIndex + 1, 0, newRight);
      node = parentInfo.node;
    }
  }

  // vis.js 用のデータに変換（内部/リーフ色分け + リーフ間リンク）
  toVisData() {
    var nodes = [];
    var edges = [];

    if (this.root === null) return { nodes: nodes, edges: edges };

    var queue = [{ node: this.root, level: 0 }];
    while (queue.length > 0) {
      var item = queue.shift();
      var node = item.node;
      var level = item.level;

      var bg = node.isLeaf ? '#7986cb' : '#90a4ae';
      var border = node.isLeaf ? '#3949ab' : '#546e7a';

      nodes.push({
        id: node.id,
        label: node.keys.join(' | '),
        level: level,
        color: { background: bg, border: border },
        font: { color: '#ffffff', size: 14, face: 'monospace' },
        shape: 'box',
        margin: { top: 8, bottom: 8, left: 12, right: 12 },
        borderWidth: 2,
      });

      for (var c = 0; c < node.children.length; c++) {
        edges.push({
          from: node.id,
          to: node.children[c].id,
          arrows: 'to',
          color: { color: '#9e9e9e' },
        });
        queue.push({ node: node.children[c], level: level + 1 });
      }

      // リーフ間リンク
      if (node.isLeaf && node.next !== null) {
        edges.push({
          from: node.id,
          to: node.next.id,
          arrows: 'to',
          dashes: true,
          color: { color: '#4fc3f7' },
          smooth: { type: 'curvedCW', roundness: 0.3 },
        });
      }
    }

    return { nodes: nodes, edges: edges };
  }

  // ランダム B+木を生成
  static generateRandom(n, order) {
    var bpt = new BPlusTree(order);
    BPlusTreeNode._nextId = 0;
    var values = new Set();
    while (values.size < n) {
      values.add(Math.floor(Math.random() * 100) + 1);
    }
    for (var v of values) {
      bpt.insert(v);
    }
    return bpt;
  }
}


// ── B-Tree Visualizer コンポーネント ─────────────────────

Vue.component('btree-visualizer', {
  template: `
  <div class="btree-container">
    <h2 class="btree-title">{{ $tl.btree.title }}</h2>
    <p class="btree-subtitle">{{ $tl.btree.subtitle }}</p>

    <div class="btree-layout">
      <!-- 操作パネル -->
      <div class="btree-panel">
        <!-- 木の種類 -->
        <div class="btree-section">
          <label class="btree-label">{{ $tl.btree.treeType }}</label>
          <div class="btree-order-group">
            <button class="btree-order-badge"
                    :class="{ active: treeType === 'btree' }"
                    :disabled="isAnimating"
                    @click="changeTreeType('btree')">Btree</button>
            <button class="btree-order-badge"
                    :class="{ active: treeType === 'bplus' }"
                    :disabled="isAnimating"
                    @click="changeTreeType('bplus')">B+tree</button>
          </div>
        </div>

        <!-- 次数選択 -->
        <div class="btree-section">
          <label class="btree-label">{{ $tl.btree.order }}</label>
          <div class="btree-order-group">
            <button v-for="m in [3, 4, 5]" :key="m"
                    class="btree-order-badge"
                    :class="{ active: order === m }"
                    :disabled="isAnimating"
                    @click="changeOrder(m)">
              {{ m }}
            </button>
          </div>
        </div>

        <!-- ランダム生成 -->
        <div class="btree-section">
          <label class="btree-label">{{ $tl.btree.randomGen }}</label>
          <div class="btree-row">
            <label class="btree-small-label">{{ $tl.btree.keyCount }}</label>
            <input type="number" v-model.number="keyCount" min="1" max="50" class="btree-input-small">
            <button class="btree-btn btree-btn-primary" @click="generateRandom" :disabled="isAnimating">
              {{ $tl.btree.randomGen }}
            </button>
          </div>
        </div>

        <!-- 検索 -->
        <div class="btree-section">
          <label class="btree-label">{{ $tl.btree.search }}</label>
          <div class="btree-row">
            <label class="btree-small-label">{{ $tl.btree.value }}</label>
            <input type="number" v-model.number="operationValue" class="btree-input-small"
                   @keyup.enter="executeSearch" :disabled="isAnimating">
            <button class="btree-btn btree-btn-accent" @click="executeSearch"
                    :disabled="isAnimating || operationValue === '' || operationValue === null">
              {{ isAnimating ? $tl.btree.animating : $tl.btree.execute }}
            </button>
          </div>
        </div>

        <!-- 速度スライダー -->
        <div class="btree-section">
          <label class="btree-label">{{ $tl.btree.speed }}</label>
          <div class="btree-speed-row">
            <span class="btree-speed-label">{{ $tl.btree.slow }}</span>
            <input type="range" v-model.number="speedMs" min="100" max="1500" step="50"
                   class="btree-slider" :disabled="isAnimating">
            <span class="btree-speed-label">{{ $tl.btree.fast }}</span>
          </div>
          <div class="btree-speed-value">{{ speedMs }}ms</div>
        </div>

        <!-- 木をクリア -->
        <div class="btree-section">
          <button class="btree-btn btree-btn-danger" @click="clearTree" :disabled="isAnimating">
            {{ $tl.btree.clearTree }}
          </button>
        </div>

        <!-- 操作ログ -->
        <div class="btree-section">
          <div class="btree-log-header">
            <label class="btree-label">{{ $tl.btree.log }}</label>
            <button class="btree-btn-text" @click="logs = []">{{ $tl.btree.clear }}</button>
          </div>
          <div class="btree-log">
            <div v-if="logs.length === 0" class="btree-log-empty">&mdash;</div>
            <div v-for="(entry, i) in logs" :key="i" class="btree-log-entry" :class="'btree-log-' + entry.type">
              {{ entry.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- vis.js ネットワーク表示 -->
      <div class="btree-network-wrapper">
        <div id="btree-network"></div>
        <div v-if="btree.root === null" class="btree-empty-message">{{ $tl.btree.empty }}</div>
      </div>
    </div>
  </div>
  `,

  data: function () {
    return {
      treeType: 'btree',
      order: 3,
      btree: new BTree(3),
      values: [],
      keyCount: 10,
      operationValue: null,
      speedMs: 500,
      isAnimating: false,
      logs: [],
      _network: null,
      _nodes: null,
      _edges: null,
      _animTimer: null,
    };
  },

  mounted: function () {
    this.generateRandom();
  },

  methods: {
    changeTreeType: function (type) {
      if (this.isAnimating) return;
      this.treeType = type;
      this.rebuildTree();
    },

    changeOrder: function (m) {
      if (this.isAnimating) return;
      this.order = m;
      this.rebuildTree();
    },

    // 保持している values から現在の treeType + order で木を再構築
    rebuildTree: function () {
      BTreeNode._nextId = 0;
      BPlusTreeNode._nextId = 0;
      if (this.treeType === 'bplus') {
        var bpt = new BPlusTree(this.order);
        for (var i = 0; i < this.values.length; i++) { bpt.insert(this.values[i]); }
        this.btree = bpt;
      } else {
        var bt = new BTree(this.order);
        for (var i = 0; i < this.values.length; i++) { bt.insert(this.values[i]); }
        this.btree = bt;
      }
      this.renderTree();
    },

    generateRandom: function () {
      var n = this.keyCount;
      if (n < 1) n = 1;
      if (n > 50) n = 50;
      var vals = new Set();
      while (vals.size < n) {
        vals.add(Math.floor(Math.random() * 100) + 1);
      }
      this.values = Array.from(vals);
      this.rebuildTree();
    },

    clearTree: function () {
      this.values = [];
      this.rebuildTree();
    },

    renderTree: function () {
      var data = this.btree.toVisData();
      this._nodes = new vis.DataSet(data.nodes);
      this._edges = new vis.DataSet(data.edges);
      var container = document.getElementById('btree-network');
      if (!container) return;
      // order が大きいほどノードが幅広なので余白を増やす
      var spacing = { 3: 100, 4: 140, 5: 180 };
      var ns = spacing[this.order] || 100;
      var options = {
        edges: {
          smooth: { type: 'cubicBezier' },
        },
        layout: {
          hierarchical: {
            enabled: true,
            direction: 'UD',
            sortMethod: 'directed',
            nodeSpacing: ns,
            levelSeparation: 100,
          }
        },
        physics: { enabled: false },
        interaction: {
          dragNodes: false,
          zoomView: true,
          dragView: true,
        },
      };
      if (this._network) this._network.destroy();
      this._network = new vis.Network(container, { nodes: this._nodes, edges: this._edges }, options);
    },

    executeSearch: function () {
      if (this.isAnimating) return;
      if (this.operationValue === '' || this.operationValue === null || isNaN(this.operationValue)) return;
      this.animateSearch(Math.floor(this.operationValue));
    },

    animateSearch: function (value) {
      var self = this;
      if (this.btree.root === null) {
        this.addLog(value + ' — ' + this.$tl.btree.empty, 'error');
        return;
      }

      var result = this.btree.search(value);
      var steps = result.steps;

      this.isAnimating = true;
      this.renderTree();

      var step = 0;
      var prevVisitId = null;

      var animate = function () {
        if (step >= steps.length) {
          if (result.found) {
            self.addLog(value + ' — ' + self.$tl.btree.found, 'success');
          } else {
            self.addLog(value + ' — ' + self.$tl.btree.notFound, 'error');
          }
          self.isAnimating = false;
          return;
        }

        var entry = steps[step];

        // 前の visit ノードをグレーに
        if (prevVisitId !== null && entry.type !== 'found') {
          self._nodes.update({
            id: prevVisitId,
            color: { background: '#b0bec5', border: '#78909c' },
          });
        }

        if (entry.type === 'visit') {
          self._nodes.update({
            id: entry.nodeId,
            color: { background: '#ffa726', border: '#ef6c00' },
          });
          prevVisitId = entry.nodeId;
        } else if (entry.type === 'found') {
          self._nodes.update({
            id: entry.nodeId,
            color: { background: '#66bb6a', border: '#2e7d32' },
          });
          prevVisitId = null;
        }

        step++;
        self._animTimer = setTimeout(animate, self.speedMs);
      };

      animate();
    },

    addLog: function (text, type) {
      this.logs.unshift({ text: text, type: type || 'info' });
      if (this.logs.length > 50) {
        this.logs.splice(50);
      }
    },
  },

  beforeDestroy: function () {
    if (this._animTimer) clearTimeout(this._animTimer);
    if (this._network) this._network.destroy();
  },
});

// ── Vue インスタンス ────────────────────────────────
new Vue({ el: '#app' });
