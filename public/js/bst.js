// ── BST Visualizer ─────────────────────────────────────
// 隠しページ: 二分探索木の操作をアニメーション付きで可視化する

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
      title: 'BST Visualizer — GRAPH × GRAPH',
      description: '二分探索木（BST）の操作をアニメーションで可視化するツール',
    },
    nav: { home: 'ホーム', howToUse: '使い方', about: 'このページについて', articles: 'AtCoder 解説' },
    footer: { privacy: 'プライバシーポリシー', contact: 'お問い合わせ' },
    bst: {
      title: '二分探索木 ビジュアライザ',
      subtitle: '挿入・削除・検索の操作をアニメーションで可視化します',
      randomGen: 'ランダム生成',
      nodeCount: 'ノード数',
      operation: '操作',
      insert: '挿入',
      delete: '削除',
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
      inserted: 'を挿入しました',
      deleted: 'を削除しました',
      notExists: 'は存在しません',
      alreadyExists: 'は既に存在しています',
      empty: '木が空です',
      animating: 'アニメーション中...',
    },
  },
  en: {
    meta: {
      title: 'BST Visualizer — GRAPH × GRAPH',
      description: 'Visualize binary search tree operations with animation',
    },
    nav: { home: 'Home', howToUse: 'How to Use', about: 'About', articles: 'AtCoder Articles' },
    footer: { privacy: 'Privacy Policy', contact: 'Contact' },
    bst: {
      title: 'Binary Search Tree Visualizer',
      subtitle: 'Visualize insert, delete, and search operations with animation',
      randomGen: 'Random Generate',
      nodeCount: 'Nodes',
      operation: 'Operation',
      insert: 'Insert',
      delete: 'Delete',
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
      inserted: 'inserted',
      deleted: 'deleted',
      notExists: 'does not exist',
      alreadyExists: 'already exists',
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


// ── BST データ構造 ─────────────────────────────────

class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.id = BSTNode._nextId++;
  }
}
BSTNode._nextId = 0;

class BST {
  constructor() {
    this.root = null;
  }

  // 挿入 — 通過ノードのリストと成功フラグを返す
  insert(value) {
    const path = [];
    if (this.root === null) {
      this.root = new BSTNode(value);
      path.push({ node: this.root, action: 'insert' });
      return { path, success: true };
    }

    let current = this.root;
    while (true) {
      path.push({ node: current, action: 'visit' });
      if (value === current.value) {
        return { path, success: false }; // 重複
      } else if (value < current.value) {
        if (current.left === null) {
          current.left = new BSTNode(value);
          path.push({ node: current.left, action: 'insert' });
          return { path, success: true };
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = new BSTNode(value);
          path.push({ node: current.right, action: 'insert' });
          return { path, success: true };
        }
        current = current.right;
      }
    }
  }

  // 検索 — 通過ノードのリストと結果を返す
  search(value) {
    const path = [];
    let current = this.root;
    while (current !== null) {
      path.push({ node: current, action: 'visit' });
      if (value === current.value) {
        path[path.length - 1].action = 'found';
        return { path, found: true };
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return { path, found: false };
  }

  // 削除 — 通過ノードのリストと成功フラグを返す
  delete(value) {
    const path = [];
    let parent = null;
    let current = this.root;
    let direction = null;

    // 対象ノードを検索
    while (current !== null) {
      path.push({ node: current, action: 'visit' });
      if (value === current.value) {
        path[path.length - 1].action = 'delete';
        break;
      } else if (value < current.value) {
        parent = current;
        direction = 'left';
        current = current.left;
      } else {
        parent = current;
        direction = 'right';
        current = current.right;
      }
    }

    if (current === null) {
      return { path, success: false };
    }

    // 子が2つある場合: 右部分木の最小値を後継者にする
    if (current.left !== null && current.right !== null) {
      let successorParent = current;
      let successor = current.right;
      path.push({ node: successor, action: 'successor' });
      while (successor.left !== null) {
        successorParent = successor;
        successor = successor.left;
        path.push({ node: successor, action: 'successor' });
      }
      current.value = successor.value;
      // 後継者ノードを削除
      if (successorParent === current) {
        successorParent.right = successor.right;
      } else {
        successorParent.left = successor.right;
      }
    }
    // 子が0個または1個の場合
    else {
      const child = current.left !== null ? current.left : current.right;
      if (parent === null) {
        this.root = child;
      } else if (direction === 'left') {
        parent.left = child;
      } else {
        parent.right = child;
      }
    }

    return { path, success: true };
  }

  // vis.js 用のデータに変換
  toVisData() {
    const nodes = [];
    const edges = [];

    if (this.root === null) return { nodes, edges };

    const queue = [{ node: this.root, level: 0 }];
    while (queue.length > 0) {
      const { node, level } = queue.shift();
      nodes.push({
        id: node.id,
        label: String(node.value),
        level: level,
        color: { background: '#7986cb', border: '#3949ab' },
        font: { color: '#ffffff', size: 16, face: 'monospace' },
        shape: 'circle',
        size: 25,
      });
      if (node.left !== null) {
        edges.push({
          from: node.id,
          to: node.left.id,
          arrows: 'to',
          color: { color: '#9e9e9e' },
        });
        queue.push({ node: node.left, level: level + 1 });
      }
      if (node.right !== null) {
        edges.push({
          from: node.id,
          to: node.right.id,
          arrows: 'to',
          color: { color: '#9e9e9e' },
        });
        queue.push({ node: node.right, level: level + 1 });
      }
    }
    return { nodes, edges };
  }

  // ランダム BST を生成
  static generateRandom(n) {
    const bst = new BST();
    BSTNode._nextId = 0;
    const values = new Set();
    while (values.size < n) {
      values.add(Math.floor(Math.random() * 100) + 1);
    }
    for (const v of values) {
      bst.insert(v);
    }
    return bst;
  }

  // ノード数をカウント
  size() {
    let count = 0;
    const stack = [this.root];
    while (stack.length > 0) {
      const node = stack.pop();
      if (node === null) continue;
      count++;
      stack.push(node.left);
      stack.push(node.right);
    }
    return count;
  }
}


// ── BST Visualizer コンポーネント ─────────────────────────

Vue.component('bst-visualizer', {
  template: `
  <div class="bst-container">
    <h2 class="bst-title">{{ $tl.bst.title }}</h2>
    <p class="bst-subtitle">{{ $tl.bst.subtitle }}</p>

    <div class="bst-layout">
      <!-- 操作パネル -->
      <div class="bst-panel">
        <!-- ランダム生成 -->
        <div class="bst-section">
          <label class="bst-label">{{ $tl.bst.randomGen }}</label>
          <div class="bst-row">
            <label class="bst-small-label">{{ $tl.bst.nodeCount }}</label>
            <input type="number" v-model.number="nodeCount" min="1" max="30" class="bst-input-small">
            <button class="bst-btn bst-btn-primary" @click="generateRandom" :disabled="isAnimating">
              {{ $tl.bst.randomGen }}
            </button>
          </div>
        </div>

        <!-- 操作選択 -->
        <div class="bst-section">
          <label class="bst-label">{{ $tl.bst.operation }}</label>
          <div class="bst-radio-group">
            <label class="bst-radio">
              <input type="radio" v-model="operation" value="insert" :disabled="isAnimating">
              <span>{{ $tl.bst.insert }}</span>
            </label>
            <label class="bst-radio">
              <input type="radio" v-model="operation" value="delete" :disabled="isAnimating">
              <span>{{ $tl.bst.delete }}</span>
            </label>
            <label class="bst-radio">
              <input type="radio" v-model="operation" value="search" :disabled="isAnimating">
              <span>{{ $tl.bst.search }}</span>
            </label>
          </div>
          <div class="bst-row" style="margin-top: 8px;">
            <label class="bst-small-label">{{ $tl.bst.value }}</label>
            <input type="number" v-model.number="operationValue" class="bst-input-small"
                   @keyup.enter="executeOperation" :disabled="isAnimating">
            <button class="bst-btn bst-btn-accent" @click="executeOperation"
                    :disabled="isAnimating || operationValue === '' || operationValue === null">
              {{ isAnimating ? $tl.bst.animating : $tl.bst.execute }}
            </button>
          </div>
        </div>

        <!-- 速度スライダー -->
        <div class="bst-section">
          <label class="bst-label">{{ $tl.bst.speed }}</label>
          <div class="bst-speed-row">
            <span class="bst-speed-label">{{ $tl.bst.slow }}</span>
            <input type="range" v-model.number="speedMs" min="100" max="1500" step="50"
                   class="bst-slider" :disabled="isAnimating">
            <span class="bst-speed-label">{{ $tl.bst.fast }}</span>
          </div>
          <div class="bst-speed-value">{{ speedMs }}ms</div>
        </div>

        <!-- 木をクリア -->
        <div class="bst-section">
          <button class="bst-btn bst-btn-danger" @click="clearTree" :disabled="isAnimating">
            {{ $tl.bst.clearTree }}
          </button>
        </div>

        <!-- 操作ログ -->
        <div class="bst-section">
          <div class="bst-log-header">
            <label class="bst-label">{{ $tl.bst.log }}</label>
            <button class="bst-btn-text" @click="logs = []">{{ $tl.bst.clear }}</button>
          </div>
          <div class="bst-log">
            <div v-if="logs.length === 0" class="bst-log-empty">—</div>
            <div v-for="(entry, i) in logs" :key="i" class="bst-log-entry" :class="'bst-log-' + entry.type">
              {{ entry.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- vis.js ネットワーク表示 -->
      <div class="bst-network-wrapper">
        <div id="bst-network"></div>
        <div v-if="bst.root === null" class="bst-empty-message">{{ $tl.bst.empty }}</div>
      </div>
    </div>
  </div>
  `,

  data: function () {
    return {
      bst: new BST(),
      nodeCount: 10,
      operation: 'insert',
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
    generateRandom: function () {
      var n = this.nodeCount;
      if (n < 1) n = 1;
      if (n > 30) n = 30;
      this.bst = BST.generateRandom(n);
      this.renderTree();
    },

    clearTree: function () {
      this.bst = new BST();
      BSTNode._nextId = 0;
      this.renderTree();
    },

    renderTree: function () {
      var data = this.bst.toVisData();
      this._nodes = new vis.DataSet(data.nodes);
      this._edges = new vis.DataSet(data.edges);
      var container = document.getElementById('bst-network');
      if (!container) return;
      var options = {
        edges: {
          smooth: { type: 'cubicBezier' },
        },
        layout: {
          hierarchical: {
            enabled: true,
            direction: 'UD',
            sortMethod: 'directed',
            nodeSpacing: 60,
            levelSeparation: 80,
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

    executeOperation: function () {
      if (this.isAnimating) return;
      if (this.operationValue === '' || this.operationValue === null || isNaN(this.operationValue)) return;
      var val = Math.floor(this.operationValue);

      switch (this.operation) {
        case 'insert':
          this.animateInsert(val);
          break;
        case 'delete':
          this.animateDelete(val);
          break;
        case 'search':
          this.animateSearch(val);
          break;
      }
    },

    animateSearch: function (value) {
      var self = this;
      if (this.bst.root === null) {
        this.addLog(value + ' — ' + this.$tl.bst.empty, 'error');
        return;
      }

      // 検索パスを事前計算
      var result = this.bst.search(value);
      var path = result.path;

      this.isAnimating = true;
      this.renderTree(); // 色をリセット

      var step = 0;
      var interval = this.speedMs;

      var animate = function () {
        if (step >= path.length) {
          // アニメーション完了
          if (result.found) {
            self.addLog(value + ' — ' + self.$tl.bst.found, 'success');
          } else {
            self.addLog(value + ' — ' + self.$tl.bst.notFound, 'error');
          }
          self.isAnimating = false;
          return;
        }

        var entry = path[step];

        // 前のステップのノードを訪問済みにする
        if (step > 0) {
          var prev = path[step - 1];
          if (prev.action !== 'found') {
            self._nodes.update({
              id: prev.node.id,
              color: { background: '#b0bec5', border: '#78909c' },
            });
          }
        }

        // 現在のノードをハイライト
        if (entry.action === 'found') {
          self._nodes.update({
            id: entry.node.id,
            color: { background: '#66bb6a', border: '#2e7d32' },
          });
        } else {
          self._nodes.update({
            id: entry.node.id,
            color: { background: '#ffa726', border: '#ef6c00' },
          });
        }

        step++;
        self._animTimer = setTimeout(animate, interval);
      };

      animate();
    },

    animateInsert: function (value) {
      var self = this;

      // 重複チェック
      if (this.bst.root !== null) {
        var check = this.bst.search(value);
        if (check.found) {
          this.addLog(value + ' — ' + this.$tl.bst.alreadyExists, 'error');
          return;
        }
      }

      // 挿入パスを事前計算（まだ挿入はしない）
      // 先にパスをシミュレートする
      var path = [];
      if (this.bst.root === null) {
        // 空の木に挿入
        this.bst.insert(value);
        this.renderTree();
        // 新ノードを緑に
        var data = this.bst.toVisData();
        if (data.nodes.length > 0) {
          this._nodes.update({
            id: data.nodes[0].id,
            color: { background: '#66bb6a', border: '#2e7d32' },
          });
        }
        this.addLog(value + ' ' + this.$tl.bst.inserted, 'success');
        return;
      }

      // パスを事前にシミュレート（挿入はしない）
      var current = this.bst.root;
      while (current !== null) {
        path.push({ node: current, action: 'visit' });
        if (value < current.value) {
          if (current.left === null) break;
          current = current.left;
        } else {
          if (current.right === null) break;
          current = current.right;
        }
      }

      this.isAnimating = true;
      this.renderTree();

      var step = 0;
      var interval = this.speedMs;

      var animate = function () {
        if (step >= path.length) {
          // 挿入実行
          self.bst.insert(value);
          self.renderTree();

          // 新しいノードを探して緑にする
          var findNew = function (node) {
            if (node === null) return null;
            if (node.value === value) return node;
            var l = findNew(node.left);
            if (l) return l;
            return findNew(node.right);
          };
          var newNode = findNew(self.bst.root);
          if (newNode) {
            self._nodes.update({
              id: newNode.id,
              color: { background: '#66bb6a', border: '#2e7d32' },
            });
          }

          self.addLog(value + ' ' + self.$tl.bst.inserted, 'success');
          self.isAnimating = false;
          return;
        }

        var entry = path[step];

        if (step > 0) {
          var prev = path[step - 1];
          self._nodes.update({
            id: prev.node.id,
            color: { background: '#b0bec5', border: '#78909c' },
          });
        }

        self._nodes.update({
          id: entry.node.id,
          color: { background: '#ffa726', border: '#ef6c00' },
        });

        step++;
        self._animTimer = setTimeout(animate, interval);
      };

      animate();
    },

    animateDelete: function (value) {
      var self = this;

      if (this.bst.root === null) {
        this.addLog(value + ' — ' + this.$tl.bst.empty, 'error');
        return;
      }

      // 存在チェック
      var check = this.bst.search(value);
      if (!check.found) {
        this.addLog(value + ' — ' + this.$tl.bst.notExists, 'error');
        return;
      }

      // 削除パスを事前計算（まだ削除しない）
      var path = check.path; // 検索パスを使い回す

      this.isAnimating = true;
      this.renderTree();

      var step = 0;
      var interval = this.speedMs;

      var animate = function () {
        if (step >= path.length) {
          // 最後のノードを赤にして一瞬待ってから削除
          self._animTimer = setTimeout(function () {
            self.bst.delete(value);
            self.renderTree();
            self.addLog(value + ' ' + self.$tl.bst.deleted, 'success');
            self.isAnimating = false;
          }, interval);
          return;
        }

        var entry = path[step];

        if (step > 0) {
          var prev = path[step - 1];
          if (prev.action !== 'found') {
            self._nodes.update({
              id: prev.node.id,
              color: { background: '#b0bec5', border: '#78909c' },
            });
          }
        }

        if (entry.action === 'found') {
          self._nodes.update({
            id: entry.node.id,
            color: { background: '#ef5350', border: '#b71c1c' },
          });
        } else {
          self._nodes.update({
            id: entry.node.id,
            color: { background: '#ffa726', border: '#ef6c00' },
          });
        }

        step++;
        self._animTimer = setTimeout(animate, interval);
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
