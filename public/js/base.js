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
function Pair(first, second) {
  this.first = first;
  this.second = second;
}

// ── 多言語対応 ───────────────────────────────────────
const appState = Vue.observable({ lang: localStorage.getItem('lang') || 'ja' });

const translations = {
  ja: {
    nav: { home: 'ホーム', howToUse: '使い方', about: 'このページについて' },
    desc: '競技プログラミングにおけるグラフ問題の入力例を可視化するサイトです。',
    feedbackLink: '改善案募集中',
    smoothEdges: '辺を滑らかに',
    urlExport: 'URL Export',
    randomGen: {
      label: 'ランダム生成', auto: '自動', generate: '生成',
      type: '種別', wMin: '最小', wMax: '最大', wLabel: '重み',
      types: { random: 'ランダム', tree: '木', connected: '連結', bipartite: '二部', dag: 'DAG', complete: '完全', path: 'パス', cycle: 'サイクル', star: 'スター', grid: 'グリッド' },
    },
    info: { vertices: '頂点', edges: '辺', components: '連結成分', scc: 'SCC' },
    badge: { tree: '木', forest: '森', complete: '完全グラフ', bipartite: '二部グラフ', dag: 'DAG', stronglyConnected: '強連結' },
    sp: { label: '最短経路', from: '始点', to: '終点', show: '表示', distance: '距離:', noPath: '経路なし', path: '経路:', allDists: '距離配列:' },
    topo: 'トポロジカル順序:',
    toast: { urlCopied: 'URLをコピーしました', copyFailed: 'コピー失敗 — URLをアドレスバーからコピーしてください', inputCopied: '入力をコピーしました' },
    editor: { copy: 'コピー', undo: '元に戻す', redo: 'やり直し' },
    history: { label: '履歴', clear: 'クリア', empty: '履歴なし', vertices: '頂点', edges: '辺' },
    errors: {
      unexpected: '入力に予期せぬ値が含まれています.',
      tooMany: '入力が多すぎます.',
      tooFew: '入力が足りていません.',
      nonInteger: '頂点数・辺数は 0 以上の整数で入力してください.',
      zeroOne: '「辺がある: 1,  辺がない: 0」 と入力してください.',
      symmetric: '無向グラフを扱う場合, 対称行列を入力してください.',
      invalidVertex: '存在しない頂点を指定しています.',
    },
    viz: { label: '可視化', components: '連結成分', bipartite: '二部グラフ彩色', mst: 'MST' },
    rootedTree: { label: '根付き木', root: '根', show: '表示' },
    howtouseLink: '使い方',
    presets: { star: 'スター', path: 'パス', cycle: 'サイクル', complete: '完全グラフ', bipartite: '二部グラフ', 'weighted-tree': '重み付き木', 'weighted-graph': '重み付きグラフ', dag: 'DAG' },
    funPresets: { 'big-star': '巨大スター', grid: 'グリッド', clusters: 'クラスタ', 'binary-tree': '二分木', caterpillar: 'カタピラ', jellyfish: 'クラゲ', 'spider-web': '蜘蛛の巣', hairball: '毛玉' },
    about: {
      whatTitle: 'GRAPH × GRAPH とは',
      whatBody: '競技プログラミングにおけるグラフ問題の入力例を、ブラウザ上でリアルタイムに可視化するツールです。\nAtCoder などのコンテスト中に入力例をそのまま貼り付けるだけで、グラフの構造を即座に確認できます。',
      featuresTitle: '主な機能',
      authorTitle: '作った人',
      authorBody1: 'が個人で開発・運営しています。',
      authorBody2: 'バグ報告・改善案は Twitter の DM または',
      authorBody3: 'こちらのツイート',
      authorBody4: 'へのリプライでお願いします。',
      techTitle: '使用技術',
      browserTitle: '推奨ブラウザ',
      browserBody: 'Google Chrome / Firefox での動作を推奨します。Safari でも動作しますが、一部機能が正常に動作しない場合があります。',
      changelogTitle: '更新履歴',
      features: [
        { title: 'リアルタイム可視化', desc: '入力を変更すると 500ms のデバウンスで自動的にグラフが更新されます。' },
        { title: 'グラフ情報の自動解析', desc: '頂点数・辺数・連結成分数のほか、木・森・完全グラフ・二部グラフ・DAG・強連結を自動判定します。' },
        { title: '最短経路の可視化', desc: '始点・終点を指定するとBFS/Dijkstraで最短経路をハイライト表示。始点のみ指定で全頂点への距離配列を表示します。' },
        { title: 'トポロジカル順序', desc: "DAGを入力すると Kahn's algorithm でトポロジカル順序を自動計算・表示します。" },
        { title: 'プリセット', desc: 'スター・パス・サイクル・完全グラフ・二部グラフ・重み付き木/グラフ・DAG の 8 種類をワンクリックで生成できます。' },
        { title: 'ランダム生成', desc: '現在の設定（indexed/directed/weighted/format）に合わせたランダムグラフを生成します。頂点数・辺数の指定も可能です。' },
        { title: 'URL 共有', desc: '現在のグラフをURLにエンコードしてクリップボードにコピー。URLを共有するだけで同じグラフを再現できます。' },
      ],
      techs: [
        { name: 'vis.js', role: 'グラフ描画ライブラリ' },
        { name: 'Vue.js 2', role: 'UIフレームワーク' },
        { name: 'Bootstrap 4', role: 'CSSフレームワーク' },
        { name: 'Firebase Hosting', role: 'ホスティング' },
      ],
      changelog: [
        { version: 'v3.0.0', desc: 'UI全面刷新・最短経路・トポロジカル順序・プリセット・URL共有・ランダム生成を追加' },
        { version: 'v2.x', desc: '隣接行列対応・有向グラフ対応・重み付きグラフ対応など' },
        { version: 'v1.0', desc: '初版リリース。AtCoder形式の無向グラフを可視化' },
      ],
    },
    howto: {
      basicTitle: '基本的な使い方',
      steps: [
        { title: '入力形式を選ぶ', desc: '画面下のドロップダウンで 1-indexed / 0-indexed、directed / undirected、weighted / unweighted、normal / matrix を選択します。' },
        { title: '入力例を貼り付ける', desc: 'AtCoder の入力例をそのままテキストエリアに貼り付けます。500ms 後に自動でグラフが描画されます。' },
        { title: 'グラフを確認する', desc: 'グラフ情報パネルで頂点数・辺数・グラフの種別（木・DAG・二部グラフなど）が自動表示されます。' },
      ],
      formatTitle: '入力形式',
      normalTitle: 'normal 形式（AtCoder 標準）',
      normalDesc: '最初の行に頂点数 N と辺数 M を書き、続く M 行に各辺を書きます。辺数 M は省略可能です。',
      normalLabels: ['重みなし（N M / u v）', '重みあり（N M / u v w）', 'M 省略（N / u v ...）'],
      matrixTitle: 'matrix 形式（隣接行列）',
      matrixDesc: '最初の行に頂点数 N を書き、続く N 行に N × N の隣接行列を書きます。重みなしの場合は 0/1、重みありの場合は辺の重み（なければ 0）を書きます。',
      matrixLabels: ['重みなし', '重みあり'],
      featuresTitle: '各機能の説明',
      faqTitle: 'よくある質問',
      features: [
        { title: 'プリセット', desc: 'ページ上部のボタンからスター・パス・サイクル・完全グラフ・二部グラフ・重み付き木/グラフ・DAG をワンクリックで読み込めます。クリックのたびにランダム生成されます。' },
        { title: 'ランダム生成', desc: '現在の設定（indexed/directed/weighted/format）に合わせたランダムグラフを生成します。N・E の欄に数値を入れると頂点数・辺数を指定して生成できます。空欄のままにすると自動で決定されます。' },
        { title: '辺を滑らかに', desc: 'チェックを入れると辺が曲線で描画されます。辺が重なって見にくいときに便利です。' },
        { title: 'グラフ情報パネル', desc: '可視化後に頂点数・辺数・連結成分数（無向グラフ）または SCC 数（有向グラフ）を表示します。木・森・完全グラフ・二部グラフ・DAG・強連結の自動判定バッジも表示されます。' },
        { title: '最短経路', desc: '始点と終点を入力して「表示」を押すと最短経路をハイライトします。重みなしは BFS、重みありは Dijkstra で自動切り替えします。始点だけ入力すると全頂点への距離配列が表示されます。' },
        { title: 'トポロジカル順序', desc: 'DAG を入力すると自動的にトポロジカル順序を計算・表示します。' },
        { title: 'URL 共有', desc: '「URL Export」ボタンを押すと現在のグラフ設定と入力内容をURLにエンコードしてクリップボードにコピーします。そのURLを共有すれば同じグラフを再現できます。' },
      ],
      faqs: [
        { q: 'グラフが表示されない', a: '入力形式の設定（indexed / directed / weighted / normal/matrix）が合っているか確認してください。エラーメッセージが入力欄の下に表示されます。' },
        { q: '辺が重なって見にくい', a: '「辺を滑らかに」チェックを入れると辺が曲線になり区別しやすくなります。' },
        { q: '辺数 M を省略できますか？', a: 'normal 形式では M の省略に対応しています。N の後に辺一覧を直接書くと自動で M を推定します。' },
        { q: '0-indexed と 1-indexed の違いは？', a: '頂点番号が 0 から始まるか 1 から始まるかの違いです。AtCoder の問題は通常 1-indexed です。' },
      ],
    },
    privacy: {
      title: 'プライバシーポリシー',
      intro: '本サイト（GRAPH × GRAPH、以下「当サイト」）では、ユーザーの利便性向上およびサービスの改善のため、以下の方針に基づき情報の収集・利用を行っています。',
      adsTitle: '広告について',
      adsBody: '当サイトでは、第三者配信の広告サービス（Google AdSense）を利用しています。広告配信事業者は、ユーザーの興味に応じた広告を表示するために Cookie を使用することがあります。Cookie の使用を望まない場合は、Google の広告設定ページからオプトアウトすることが可能です。詳しくは Google のポリシーと規約をご確認ください。',
      analyticsTitle: 'アクセス解析について',
      analyticsBody: '当サイトでは、サイト利用状況の把握のためにアクセス解析ツールを使用する場合があります。これらのツールはトラフィックデータの収集のために Cookie を使用しています。このデータは匿名で収集されており、個人を特定するものではありません。',
      cookieTitle: 'Cookie について',
      cookieBody: 'Cookie とは、ウェブサイトがユーザーのブラウザに保存する小さなテキストファイルです。当サイトでは、広告配信およびアクセス解析の目的で Cookie を使用しています。ブラウザの設定により Cookie の受け入れを拒否することも可能ですが、一部のサービスが正常に機能しなくなる場合があります。',
      disclaimerTitle: '免責事項',
      disclaimerBody: '当サイトのコンテンツや情報について、可能な限り正確な情報を提供するよう努めていますが、正確性や安全性を保証するものではありません。当サイトに掲載された情報によって生じたいかなる損害についても、当サイトは責任を負いかねます。',
      copyrightTitle: '著作権について',
      copyrightBody: '当サイトのコンテンツ（テキスト、画像、ソースコード等）の著作権は管理者に帰属します。無断転載・複製はご遠慮ください。',
      changeTitle: 'プライバシーポリシーの変更について',
      changeBody: '当サイトは、必要に応じて本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、当サイトに掲載された時点から効力を生じるものとします。',
      lastUpdated: '最終更新日: 2026年4月15日',
    },
    contact: {
      title: 'お問い合わせ',
      intro: '当サイト（GRAPH × GRAPH）に関するお問い合わせは、以下の方法でご連絡ください。',
      twitterTitle: 'Twitter（X）',
      twitterBody: '開発者 @monkukui の DM またはリプライでお気軽にご連絡ください。',
      twitterLink: 'Twitter で連絡する',
      githubTitle: 'GitHub Issues',
      githubBody: 'バグ報告や機能リクエストは GitHub Issues からもお寄せいただけます。',
      githubLink: 'GitHub Issues を開く',
      note: '※ お返事には数日いただく場合があります。',
    },
    indexContent: {
      whatTitle: 'GRAPH × GRAPH とは',
      whatBody: 'GRAPH × GRAPH は、競技プログラミングにおけるグラフ問題の入力例をブラウザ上でリアルタイムに可視化するツールです。AtCoder や Codeforces などのコンテスト中に入力例をそのまま貼り付けるだけで、グラフの構造を即座に確認できます。有向グラフ・無向グラフ・重み付きグラフ・隣接行列形式に対応しており、幅広い問題形式をカバーしています。',
      featuresTitle: '主な機能',
      features: [
        { title: 'リアルタイム可視化', desc: '入力を変更すると自動的にグラフが更新されます。デバッグや構造確認が瞬時に行えます。' },
        { title: 'グラフ解析', desc: '木・森・完全グラフ・二部グラフ・DAG・強連結など、グラフの性質を自動判定して表示します。' },
        { title: '最短経路・トポロジカル順序', desc: 'BFS/Dijkstra による最短経路の可視化や、DAG のトポロジカル順序の自動計算に対応しています。' },
        { title: 'プリセット・ランダム生成', desc: 'スター・パス・サイクルなど 8 種類のプリセットや、カスタムサイズのランダムグラフをワンクリックで生成できます。' },
      ],
      howtoTitle: '使い方',
      steps: [
        { num: '1', title: '入力形式を選ぶ', desc: '画面下のドロップダウンで indexed / directed / weighted / format を選択します。' },
        { num: '2', title: '入力例を貼り付ける', desc: 'AtCoder の入力例をそのままテキストエリアに貼り付けると、自動でグラフが描画されます。' },
        { num: '3', title: 'グラフを確認する', desc: 'グラフ情報パネルで頂点数・辺数・グラフの種別が自動表示されます。' },
      ],
      howtoMore: '詳しい使い方はこちら',
    },
    footer: {
      privacy: 'プライバシーポリシー',
      contact: 'お問い合わせ',
    },
  },
  en: {
    nav: { home: 'Home', howToUse: 'How to use', about: 'About' },
    desc: 'A tool to visualize graph problems in competitive programming.',
    feedbackLink: 'Feedback welcome',
    smoothEdges: 'Smooth edges',
    urlExport: 'URL Export',
    randomGen: {
      label: 'Random', auto: 'auto', generate: 'Generate',
      type: 'Type', wMin: 'Min', wMax: 'Max', wLabel: 'Weight',
      types: { random: 'Random', tree: 'Tree', connected: 'Connected', bipartite: 'Bipartite', dag: 'DAG', complete: 'Complete', path: 'Path', cycle: 'Cycle', star: 'Star', grid: 'Grid' },
    },
    info: { vertices: 'Vertices', edges: 'Edges', components: 'Components', scc: 'SCC' },
    badge: { tree: 'Tree', forest: 'Forest', complete: 'Complete', bipartite: 'Bipartite', dag: 'DAG', stronglyConnected: 'Strongly Connected' },
    sp: { label: 'Shortest Path', from: 'From', to: 'To', show: 'Show', distance: 'Dist:', noPath: 'No path', path: 'Path:', allDists: 'Distances:' },
    topo: 'Topological Order:',
    toast: { urlCopied: 'URL copied!', copyFailed: 'Copy failed — please copy from the address bar', inputCopied: 'Input copied!' },
    editor: { copy: 'Copy', undo: 'Undo', redo: 'Redo' },
    history: { label: 'History', clear: 'Clear', empty: 'No history', vertices: 'V', edges: 'E' },
    errors: {
      unexpected: 'Input contains unexpected values.',
      tooMany: 'Too many values in input.',
      tooFew: 'Not enough values in input.',
      nonInteger: 'Vertex/edge counts must be non-negative integers.',
      zeroOne: 'Use 1 for edge, 0 for no edge.',
      symmetric: 'For undirected graphs, the matrix must be symmetric.',
      invalidVertex: 'Invalid vertex specified.',
    },
    viz: { label: 'Visualize', components: 'Components', bipartite: 'Bipartite Color', mst: 'MST' },
    rootedTree: { label: 'Rooted Tree', root: 'Root', show: 'Show' },
    howtouseLink: 'How to use',
    presets: { star: 'Star', path: 'Path', cycle: 'Cycle', complete: 'Complete', bipartite: 'Bipartite', 'weighted-tree': 'Weighted Tree', 'weighted-graph': 'Weighted Graph', dag: 'DAG' },
    funPresets: { 'big-star': 'Big Star', grid: 'Grid', clusters: 'Clusters', 'binary-tree': 'Binary Tree', caterpillar: 'Caterpillar', jellyfish: 'Jellyfish', 'spider-web': 'Spider Web', hairball: 'Hairball' },
    about: {
      whatTitle: 'What is GRAPH × GRAPH?',
      whatBody: 'A browser-based tool for visualizing graph problems in competitive programming.\nJust paste an input example from an AtCoder contest and instantly see the graph structure.',
      featuresTitle: 'Features',
      authorTitle: 'Author',
      authorBody1: 'developed and maintains this site independently.',
      authorBody2: 'Bug reports and suggestions: DM on Twitter or reply to',
      authorBody3: 'this tweet',
      authorBody4: '.',
      techTitle: 'Technologies',
      browserTitle: 'Recommended Browsers',
      browserBody: 'Google Chrome and Firefox are recommended. Safari also works, but some features may not function correctly.',
      changelogTitle: 'Changelog',
      features: [
        { title: 'Real-time Visualization', desc: 'Graph updates automatically with 500ms debounce as you type.' },
        { title: 'Graph Analysis', desc: 'Auto-detects vertices, edges, components, tree, forest, complete graph, bipartite, DAG, and strong connectivity.' },
        { title: 'Shortest Path', desc: 'BFS or Dijkstra shortest path with visual highlighting. Source-only mode shows all distances.' },
        { title: 'Topological Order', desc: "Automatically computes topological order for DAGs using Kahn's algorithm." },
        { title: 'Presets', desc: '8 preset graph types — star, path, cycle, complete, bipartite, weighted tree/graph, DAG — generated randomly on each click.' },
        { title: 'Random Generation', desc: 'Generate a random graph matching the current settings. Optionally specify vertex/edge count.' },
        { title: 'URL Export', desc: 'Encode the current graph into a shareable URL and copy it to the clipboard.' },
      ],
      techs: [
        { name: 'vis.js', role: 'Graph rendering library' },
        { name: 'Vue.js 2', role: 'UI framework' },
        { name: 'Bootstrap 4', role: 'CSS framework' },
        { name: 'Firebase Hosting', role: 'Hosting' },
      ],
      changelog: [
        { version: 'v3.0.0', desc: 'Full UI redesign, shortest path, topological order, presets, URL export, random generation' },
        { version: 'v2.x', desc: 'Added adjacency matrix, directed graphs, weighted graphs, and more' },
        { version: 'v1.0', desc: 'Initial release — visualize undirected graphs in AtCoder format' },
      ],
    },
    howto: {
      basicTitle: 'Basic Usage',
      steps: [
        { title: 'Choose input format', desc: 'Use the dropdowns to select 1-indexed / 0-indexed, directed / undirected, weighted / unweighted, and normal / matrix.' },
        { title: 'Paste the input', desc: 'Paste an AtCoder input example into the text area. The graph will render automatically after 500ms.' },
        { title: 'Read the graph', desc: 'The info panel shows vertex/edge counts and auto-detected graph type (tree, DAG, bipartite, etc.).' },
      ],
      formatTitle: 'Input Formats',
      normalTitle: 'Normal format (AtCoder standard)',
      normalDesc: 'First line: N (vertices) and M (edges). Next M lines: each edge. M can be omitted.',
      normalLabels: ['Unweighted (N M / u v)', 'Weighted (N M / u v w)', 'M omitted (N / u v ...)'],
      matrixTitle: 'Matrix format (adjacency matrix)',
      matrixDesc: 'First line: N. Next N lines: N×N adjacency matrix. Use 0/1 for unweighted, or edge weight (0 if absent) for weighted.',
      matrixLabels: ['Unweighted', 'Weighted'],
      featuresTitle: 'Feature Details',
      faqTitle: 'FAQ',
      features: [
        { title: 'Presets', desc: 'Click preset buttons at the top to load star, path, cycle, complete, bipartite, weighted tree/graph, or DAG. A new random instance is generated each click.' },
        { title: 'Random Generation', desc: 'Generates a random graph with current settings. Enter values in N/E fields to specify size; leave blank for automatic.' },
        { title: 'Smooth Edges', desc: 'Draws edges as curves to help distinguish overlapping edges.' },
        { title: 'Graph Info Panel', desc: 'Shows vertex/edge counts, components or SCC count, and type badges (tree, forest, complete, bipartite, DAG, strongly connected).' },
        { title: 'Shortest Path', desc: 'Enter source and destination, press Show to highlight the shortest path. Unweighted uses BFS, weighted uses Dijkstra. Source-only shows all distances.' },
        { title: 'Topological Order', desc: 'Automatically computes and displays topological order when a DAG is detected.' },
        { title: 'URL Export', desc: 'Press URL Export to encode the current graph into a URL and copy it to the clipboard. Share the URL to reproduce the same graph.' },
      ],
      faqs: [
        { q: 'Graph is not showing', a: 'Check that the format settings (indexed / directed / weighted / normal or matrix) match your input. Error messages appear below the text area.' },
        { q: 'Edges are overlapping', a: 'Enable "Smooth edges" to draw edges as curves for easier distinction.' },
        { q: 'Can I omit edge count M?', a: 'Yes. In normal format, M can be omitted. Write N on the first line and list edges directly.' },
        { q: 'What is the difference between 0-indexed and 1-indexed?', a: 'Whether vertex labels start from 0 or 1. AtCoder problems are usually 1-indexed.' },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      intro: 'This website (GRAPH × GRAPH, hereinafter "this site") collects and uses information based on the following policies to improve user experience and service quality.',
      adsTitle: 'Advertising',
      adsBody: 'This site uses third-party advertising services (Google AdSense). Advertising providers may use cookies to display ads based on user interests. If you do not wish to use cookies, you can opt out through Google\'s ad settings page. Please refer to Google\'s policies and terms for details.',
      analyticsTitle: 'Access Analytics',
      analyticsBody: 'This site may use analytics tools to understand site usage. These tools use cookies to collect traffic data. This data is collected anonymously and does not identify individuals.',
      cookieTitle: 'Cookies',
      cookieBody: 'Cookies are small text files stored in your browser by websites. This site uses cookies for advertising and analytics purposes. You can configure your browser to reject cookies, but some services may not function properly.',
      disclaimerTitle: 'Disclaimer',
      disclaimerBody: 'While we strive to provide accurate information, we do not guarantee the accuracy or safety of the content on this site. We are not responsible for any damages arising from information published on this site.',
      copyrightTitle: 'Copyright',
      copyrightBody: 'The content of this site (text, images, source code, etc.) is copyrighted by the site administrator. Unauthorized reproduction is prohibited.',
      changeTitle: 'Changes to This Policy',
      changeBody: 'This site may change this privacy policy as needed. The revised privacy policy takes effect from the time it is published on this site.',
      lastUpdated: 'Last updated: April 15, 2026',
    },
    contact: {
      title: 'Contact',
      intro: 'For inquiries about this site (GRAPH × GRAPH), please contact us through the following methods.',
      twitterTitle: 'Twitter (X)',
      twitterBody: 'Feel free to contact the developer @monkukui via DM or reply.',
      twitterLink: 'Contact on Twitter',
      githubTitle: 'GitHub Issues',
      githubBody: 'Bug reports and feature requests can also be submitted via GitHub Issues.',
      githubLink: 'Open GitHub Issues',
      note: '* Replies may take a few days.',
    },
    indexContent: {
      whatTitle: 'What is GRAPH × GRAPH?',
      whatBody: 'GRAPH × GRAPH is a browser-based tool for visualizing graph problems in competitive programming. Just paste an input example from AtCoder, Codeforces, or similar contests and instantly see the graph structure. It supports directed/undirected graphs, weighted graphs, and adjacency matrix format, covering a wide range of problem types.',
      featuresTitle: 'Key Features',
      features: [
        { title: 'Real-time Visualization', desc: 'The graph updates automatically as you edit the input, enabling instant debugging and structure verification.' },
        { title: 'Graph Analysis', desc: 'Automatically detects and displays graph properties: tree, forest, complete, bipartite, DAG, and strongly connected.' },
        { title: 'Shortest Path & Topological Order', desc: 'Visualize shortest paths using BFS/Dijkstra, and auto-compute topological order for DAGs.' },
        { title: 'Presets & Random Generation', desc: 'Generate 8 preset graph types (star, path, cycle, etc.) or custom-sized random graphs with one click.' },
      ],
      howtoTitle: 'How to Use',
      steps: [
        { num: '1', title: 'Choose input format', desc: 'Select indexed / directed / weighted / format from the dropdowns below.' },
        { num: '2', title: 'Paste the input', desc: 'Paste an AtCoder input example into the text area, and the graph renders automatically.' },
        { num: '3', title: 'Read the graph', desc: 'The info panel shows vertex/edge counts and auto-detected graph type.' },
      ],
      howtoMore: 'See full guide',
    },
    footer: {
      privacy: 'Privacy Policy',
      contact: 'Contact',
    },
  },
};

Vue.mixin({
  computed: {
    $tl() { return translations[appState.lang]; },
    $lang() { return appState.lang; },
  },
  methods: {
    $setLang(lang) { appState.lang = lang; localStorage.setItem('lang', lang); },
  },
});

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
    <a class="navbar-brand" href="index.html"> <span style="margin-right: 1em;"></span> <font size="5">GRAPH × GRAPH</font></a>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
      <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
        <div>
          <li v-if="isIndex" class="nav-item active">
            <a class="nav-link" href="index.html">{{ $tl.nav.home }} <span class="sr-only">(current)</span></a>
          </li>
          <li v-else class="nav-item">
            <a class="nav-link" href="index.html">{{ $tl.nav.home }}</a>
          </li>
        </div>
        <div>
          <li v-if="isHowtouse" class="nav-item active">
            <a class="nav-link" href="howtouse.html">{{ $tl.nav.howToUse }}<span class="sr-only">(current)</span></a>
          </li>
          <li v-else class="nav-item">
            <a class="nav-link" href="howtouse.html">{{ $tl.nav.howToUse }}</a>
          </li>
        </div>
        <div>
          <li v-if="isAbout" class="nav-item active">
            <a class="nav-link" href="about.html">{{ $tl.nav.about }}<span class="sr-only">(current)</span></a>
          </li>
          <li v-else class="nav-item">
            <a class="nav-link" href="about.html">{{ $tl.nav.about }}</a>
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

  data: function () {
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
    <div id="logo"><img :src="image" alt="logo" width="160" height="98"></div>
    <div id="hoge">ver.{{ version }}</div>
    <div class="dropdown-divider" style="width:100%; margin-top: 16px;"></div>
  </div>
  `,
  data: function () {
    return {
      logoname: 'logo8',
      version: '3.0.0'
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
      <div class="footer-links" align="center">
        <a href="privacy.html">{{ $tl.footer.privacy }}</a>
        <span class="footer-sep">|</span>
        <a href="contact.html">{{ $tl.footer.contact }}</a>
      </div>
      <div id="footer" align="center"><small>Copyright (c) monkukui All Right Reserved.</small></div>
    </div>
  `,
})


Vue.component('graphgraph', {
  template: `
    <div id="graphgraph">

      <transition name="toast">
        <div v-if="toastVisible" class="toast-notification">{{ toastMessage }}</div>
      </transition>

      <div class="preset-row">
        <span class="preset-label" @click="funClickCount++; if(funClickCount >= 5) showFunPresets = true;" style="cursor: default;">{{ $lang === 'ja' ? 'サンプル:' : 'Preset:' }}</span>
        <button v-for="p in presetTypes" :key="p" class="btn-preset" v-on:click="loadPreset(p)">{{ $tl.presets[p] }}</button>
      </div>
      <div class="preset-row fun-preset-row" v-if="showFunPresets">
        <span class="preset-label" style="opacity:0.6;">{{ $lang === 'ja' ? '???' : '???' }}</span>
        <button v-for="p in funPresetTypes" :key="p" class="btn-preset btn-preset-fun" v-on:click="loadPreset(p)">{{ $tl.funPresets[p] }}</button>
      </div>

      <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 8px;">
        {{ $tl.desc }}
        <a href="https://twitter.com/monkukui/status/1413176697189400587?s=20" style="font-size:0.82rem; margin-left:8px;">{{ $tl.feedbackLink }}</a>
      </p>

      <div class="main-layout">
        <div class="main-layout-editor">
          <div class="editor-toolbar">
            <button class="btn-editor" v-on:click="undoInput" :disabled="undoStack.length === 0" :title="$tl.editor.undo + ' (Ctrl+Z)'">↩ {{ $tl.editor.undo }}</button>
            <button class="btn-editor" v-on:click="redoInput" :disabled="redoStack.length === 0" :title="$tl.editor.redo + ' (Ctrl+Y)'">↪ {{ $tl.editor.redo }}</button>
            <button class="btn-editor" v-on:click="copyInput" :disabled="!inputText" :title="$tl.editor.copy">⧉ {{ $tl.editor.copy }}</button>
          </div>
          <div class="editor-wrapper" :class="{'input-error': !valid}">
            <div class="line-numbers" ref="lineNumbers">
              <span v-for="n in lineCount" :key="n">{{ n }}</span>
            </div>
            <textarea id="input_area" v-model="inputText" rows="22" placeholder="" @scroll="syncLineNumbers" @keydown="handleEditorKeydown"></textarea>
          </div>
          <div v-if="!valid" class="inline-error">{{ errorMessage }}　<a href="howtouse.html">{{ $tl.howtouseLink }}</a></div>
        </div>
        <div class="main-layout-graph">
          <div class="network-wrapper">
            <div id="network"></div>
            <div v-if="isLoading" class="spinner-overlay">
              <div class="spinner"></div>
            </div>
          </div>
          <div class="smooth-toggle-area">
            <label for="smoothCheckbox">{{ $tl.smoothEdges }}</label>
            <input id="smoothCheckbox" type="checkbox" v-model="isSmooth" />
          </div>
        </div>
      </div>

      <div class="settings-panel">
        <div class="settings-panel-dropdowns">
          <div class="btn-group">
            <button v-if="indexed" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">1-indexed</button>
            <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">0-indexed</button>
            <div class="dropdown-menu">
              <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(-1, -1, -1, false)">0-indexed</button>
              <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(-1, -1, -1, true)">1-indexed</button>
            </div>
          </div>
          <div class="btn-group">
            <button v-if="directed" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">directed</button>
            <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">undirected</button>
            <div class="dropdown-menu">
              <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(-1, false, -1, -1)">undirected</button>
              <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(-1, true, -1, -1)">directed</button>
            </div>
          </div>
          <div class="btn-group">
            <button v-if="weighted" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">weighted</button>
            <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">unweighted</button>
            <div class="dropdown-menu">
              <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(-1, -1, false, -1)">unweighted</button>
              <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(-1, -1, true, -1)">weighted</button>
            </div>
          </div>
          <div class="btn-group">
            <button v-if="format" class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">normal</button>
            <button v-else class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">matrix</button>
            <div class="dropdown-menu">
              <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(false, -1, -1, -1)">matrix</button>
              <button class="dropdown-item" type="button" v-on:click="setPlaceHolder(true, -1, -1, -1)">normal</button>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-outline-success" v-on:click="exportURL">{{ $tl.urlExport }}</button>
      </div>

      <div class="settings-panel">
        <span class="random-gen-label">{{ $tl.randomGen.label }}</span>
        <div class="random-gen-field">
          <label class="random-gen-field-label">{{ $tl.randomGen.type }}</label>
          <select v-model="randomType" class="random-gen-select">
            <option v-for="t in randomGraphTypes" :key="t" :value="t">{{ $tl.randomGen.types[t] }}</option>
          </select>
        </div>
        <div class="random-gen-field">
          <label class="random-gen-field-label">N</label>
          <input type="number" v-model.number="randomN" class="random-gen-input" :placeholder="$tl.randomGen.auto" min="1" :max="maxRandomN">
        </div>
        <div v-if="format && showEdgeCount" class="random-gen-field">
          <label class="random-gen-field-label">E</label>
          <input type="number" v-model.number="randomE" class="random-gen-input" :placeholder="$tl.randomGen.auto" min="0">
        </div>
        <div v-if="weighted" class="random-gen-field">
          <label class="random-gen-field-label">W</label>
          <input type="number" v-model.number="randomWMin" class="random-gen-input random-gen-input-w" placeholder="1" min="1">
          <span class="random-gen-sep">~</span>
          <input type="number" v-model.number="randomWMax" class="random-gen-input random-gen-input-w" placeholder="100" min="1">
        </div>
        <button class="btn-random-gen" v-on:click="generateRandom">{{ $tl.randomGen.generate }}</button>
      </div>

      <div v-if="graphInfo.visible" class="graph-info-panel">
        <span class="info-item">{{ $tl.info.vertices }} <span class="info-value">{{ graphInfo.vertices }}</span></span>
        <span class="info-item">{{ $tl.info.edges }} <span class="info-value">{{ graphInfo.edges }}</span></span>
        <span v-if="!graphInfo.directed" class="info-item">{{ $tl.info.components }} <span class="info-value">{{ graphInfo.components }}</span></span>
        <span v-if="graphInfo.directed" class="info-item">{{ $tl.info.scc }} <span class="info-value">{{ graphInfo.sccCount }}</span></span>
        <span v-if="graphInfo.isTree" class="tree-badge">{{ $tl.badge.tree }}</span>
        <span v-if="graphInfo.isForest" class="forest-badge">{{ $tl.badge.forest }}</span>
        <span v-if="graphInfo.isComplete" class="complete-badge">{{ $tl.badge.complete }}</span>
        <span v-if="graphInfo.isBipartite" class="bipartite-badge">{{ $tl.badge.bipartite }}</span>
        <span v-if="graphInfo.isDAG" class="dag-badge">{{ $tl.badge.dag }}</span>
        <span v-if="graphInfo.isStronglyConnected" class="scc-badge">{{ $tl.badge.stronglyConnected }}</span>
      </div>
      <div v-if="graphInfo.visible" class="feature-row">
        <div class="feature-section">
          <span class="feature-label">{{ $tl.sp.label }}</span>
          <input type="number" v-model.number="spFrom" class="node-input" :placeholder="$tl.sp.from">
          <span class="feature-arrow">→</span>
          <input type="number" v-model.number="spTo" class="node-input" :placeholder="$tl.sp.to">
          <button class="btn-feature" v-on:click="findAndHighlightPath">{{ $tl.sp.show }}</button>
          <span v-if="spResult !== null" class="feature-result">{{ $tl.sp.distance }} <strong>{{ spResult }}</strong></span>
          <span v-if="spNoPath" class="feature-noresult">{{ $tl.sp.noPath }}</span>
          <button v-if="spResult !== null || spNoPath" class="btn-feature-reset" v-on:click="resetPath">✕</button>
        </div>
        <div v-if="spPath.length > 0" class="sp-path-panel">
          <span class="topo-label">{{ $tl.sp.path }}</span>
          <span v-for="(node, i) in spPath" :key="i" class="topo-node">{{ node }}<span v-if="i < spPath.length - 1" class="topo-arrow"> → </span></span>
        </div>
        <div v-if="spAllDists" class="sp-all-dists-panel">
          <span class="topo-label">{{ $tl.sp.allDists }}</span>
          <span v-for="item in spAllDists" :key="item.v" class="dist-item" :class="{'dist-from': item.isFrom, 'dist-unreachable': !item.reachable}">
            <span class="dist-vertex">{{ item.v }}</span>
            <span class="dist-value">{{ item.d }}</span>
          </span>
        </div>
      </div>

      <div v-if="graphInfo.visible" class="feature-row">
        <div class="feature-section">
          <span class="feature-label">{{ $tl.viz.label }}</span>
          <button class="btn-feature" :class="{'btn-feature-active': vizMode === 'components'}" v-on:click="toggleViz('components')">{{ $tl.viz.components }}</button>
          <button v-if="graphInfo.isBipartite" class="btn-feature" :class="{'btn-feature-active': vizMode === 'bipartite'}" v-on:click="toggleViz('bipartite')">{{ $tl.viz.bipartite }}</button>
          <button v-if="!graphInfo.directed" class="btn-feature" :class="{'btn-feature-active': vizMode === 'mst'}" v-on:click="toggleViz('mst')">{{ $tl.viz.mst }}</button>
          <button v-if="vizMode" class="btn-feature-reset" v-on:click="toggleViz(null)">✕</button>
        </div>
      </div>

      <div v-if="(graphInfo.isTree || graphInfo.isForest) && graphInfo.visible" class="feature-row">
        <div class="feature-section">
          <span class="feature-label">{{ $tl.rootedTree.label }}</span>
          <input type="number" v-model.number="rootNode" class="node-input" :placeholder="$tl.rootedTree.root">
          <button class="btn-feature" v-on:click="showRootedTree">{{ $tl.rootedTree.show }}</button>
          <button v-if="isRootedTreeMode" class="btn-feature-reset" v-on:click="resetRootedTree">✕</button>
        </div>
      </div>

      <div v-if="graphInfo.isDAG && graphInfo.topoOrder" class="topo-order">
        <span class="topo-label">{{ $tl.topo }}</span>
        <span v-for="(node, i) in graphInfo.topoOrder" :key="i" class="topo-node">{{ node }}<span v-if="i < graphInfo.topoOrder.length - 1" class="topo-arrow"> → </span></span>
      </div>

      <div class="history-panel">
        <div class="history-header">
          <span class="history-label">{{ $tl.history.label }}</span>
          <button v-if="graphHistory.length > 0" class="btn-history-clear" v-on:click="clearHistory">{{ $tl.history.clear }}</button>
        </div>
        <div v-if="graphHistory.length === 0" class="history-empty">{{ $tl.history.empty }}</div>
        <div v-else class="history-list">
          <div v-for="(entry, i) in graphHistory" :key="i" class="history-item" v-on:click="restoreHistory(i)">
            <span class="history-time">{{ formatHistoryTime(entry.timestamp) }}</span>
            <span class="history-meta">{{ $tl.history.vertices }}{{ entry.vertices }} {{ $tl.history.edges }}{{ entry.edges }}</span>
            <span class="history-flags">
              <span v-if="entry.directed" class="history-flag">directed</span>
              <span v-if="entry.weighted" class="history-flag">weighted</span>
            </span>
            <span class="history-preview">{{ entry.text.split('\\n')[0] }}{{ entry.text.includes('\\n') ? ' …' : '' }}</span>
          </div>
        </div>
      </div>
    </div>
  `,

  data: function () {
    return {
      // 不明瞭だけど、こうするしかなかったんです...
      format: true,      // true := normal, false := matrix
      directed: false,   // true := directed, false := undirected
      weighted: false,   // true := weighted, false := undirected
      indexed: true,     // true := 1-indexed, false := 0-indexed

      inputText: "",
      placeHolder: "10 9\n1 2\n1 3\n1 4\n1 5\n1 6\n1 7\n1 8\n1 9\n1 10",
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

      // ローディング
      isLoading: false,

      // Undo / Redo
      undoStack: [],
      redoStack: [],
      _isUndoRedo: false,

      // ランダム生成の指定値（空 = 自動）
      graphHistory: [],

      randomN: '',
      randomE: '',
      randomType: 'random',
      randomWMin: '',
      randomWMax: '',
      randomGraphTypes: ['random', 'tree', 'connected', 'bipartite', 'dag', 'complete', 'path', 'cycle', 'star', 'grid'],

      // Toast 通知
      toastMessage: '',
      toastVisible: false,

      // 最短経路
      spFrom: '', spTo: '', spResult: null, spNoPath: false, spPath: [],
      spAllDists: null,

      // 可視化モード ('components' | 'bipartite' | 'mst' | null)
      vizMode: null,

      // 根付き木
      rootNode: '',
      isRootedTreeMode: false,


      // グラフ情報パネル
      graphInfo: {
        visible: false,
        vertices: 0,
        edges: 0,
        components: 0,
        isTree: false,
      },

      // サンプルグラフのプリセット（クリックごとにランダム生成）
      presetTypes: ['star', 'path', 'cycle', 'complete', 'bipartite', 'weighted-tree', 'weighted-graph', 'dag'],
      funPresetTypes: ['big-star', 'grid', 'clusters', 'binary-tree', 'caterpillar', 'jellyfish', 'spider-web', 'hairball'],
      showFunPresets: false,
      funClickCount: 0,
    }
  },

  computed: {
    showEdgeCount() {
      return ['random', 'connected', 'bipartite'].includes(this.randomType);
    },
    maxRandomN() {
      if (!this.format) return 20;
      if (this.randomType === 'complete') return 15;
      return 500;
    },
    lineCount() {
      const text = this.inputText || this.placeHolder;
      return Math.max(text.split('\n').length, 22);
    }
  },

  methods: {

    setPlaceHolder: function (format, directed, weighted, indexed) {

      if (format != -1) this.format = format;
      if (weighted != -1) this.weighted = weighted;
      if (directed != -1) this.directed = directed;
      if (indexed != -1) this.indexed = indexed;

      let container = document.getElementById("input_area");

      // 0-indexed 重みなし無向グラフ
      if (!this.indexed && !this.weighted && !this.directed && this.format) container.placeholder = "4 3\n0 1\n1 2\n2 3";
      if (!this.indexed && !this.weighted && !this.directed && !this.format) container.placeholder = "4\n0 1 0 0\n1 0 1 0\n0 1 0 1\n0 0 1 0";

      // 0-indexed 重みなし有向グラフ
      if (!this.indexed && !this.weighted && this.directed && this.format) container.placeholder = "4 3\n0 1\n1 2\n2 3";
      if (!this.indexed && !this.weighted && this.directed && !this.format) container.placeholder = "4\n0 1 0 0\n0 0 1 0\n0 0 0 1\n0 0 0 0";

      // 0-indexed 重みあり無向グラフ
      if (!this.indexed && this.weighted && !this.directed && this.format) container.placeholder = "4 3\n0 1 3\n1 2 2\n2 3 10";
      if (!this.indexed && this.weighted && !this.directed && !this.format) container.placeholder = "4\n0 3 0 0\n3 0 2 0\n0 2 0 10\n0 0 10 0";

      // 0-indexed 重みあり有向グラフ
      if (!this.indexed && this.weighted && this.directed && this.format) container.placeholder = "4 3\n0 1 3\n1 2 2\n2 3 10";
      if (!this.indexed && this.weighted && this.directed && !this.format) container.placeholder = "4\n0 3 0 0\n0 0 2 0\n0 0 0 10\n0 0 0 0";


      // 1-indexed 重みなし無向グラフ
      if (this.indexed && !this.weighted && !this.directed && this.format) container.placeholder = "10 9\n1 2\n1 3\n1 4\n1 5\n1 6\n1 7\n1 8\n1 9\n1 10";
      if (this.indexed && !this.weighted && !this.directed && !this.format) container.placeholder = "4\n0 1 0 0\n1 0 1 0\n0 1 0 1\n0 0 1 0";

      // 1-indexed 重みなし有向グラフ
      if (this.indexed && !this.weighted && this.directed && this.format) container.placeholder = "4 3\n1 2\n2 3\n3 4";
      if (this.indexed && !this.weighted && this.directed && !this.format) container.placeholder = "4\n0 1 0 0\n0 0 1 0\n0 0 0 1\n0 0 0 0";

      // 1-indexed 重みあり無向グラフ
      if (this.indexed && this.weighted && !this.directed && this.format) container.placeholder = "4 3\n1 2 3\n2 3 2\n3 4 10";
      if (this.indexed && this.weighted && !this.directed && !this.format) container.placeholder = "4\n0 3 0 0\n3 0 2 0\n0 2 0 10\n0 0 10 0";

      // 1-indexed 重みあり有向グラフ
      if (this.indexed && this.weighted && this.directed && this.format) container.placeholder = "4 3\n1 2 3\n2 3 2\n3 4 10";
      if (this.indexed && this.weighted && this.directed && !this.format) container.placeholder = "4\n0 3 0 0\n0 0 2 0\n0 0 0 10\n0 0 0 0";

      this.placeHolder = container.placeholder;
    },

    validator: function (arr) {
      this.valid = true;

      // NaN が入ってたらダメ
      for (let i = 0; i < arr.length; i++) {
        if (isNaN(arr[i])) {
          this.errorMessage = this.$tl.errors.unexpected;
          this.valid = false;
          return [];
        }
      }

      // N が非負整数かチェック（小数・負の値は new Array() でクラッシュする）
      if (!Number.isInteger(arr[0]) || arr[0] < 0) {
        this.errorMessage = this.$tl.errors.nonInteger;
        this.valid = false;
        return [];
      }

      if (!this.format) {

        // 隣接行列
        let n = arr[0];

        // 必要な数だけ入力があるかどうか
        if (n * n + 1 < arr.length) {
          this.errorMessage = this.$tl.errors.tooMany;
          this.valid = false;
          return [];
        }

        if (n * n + 1 > arr.length) {
          this.errorMessage = this.$tl.errors.tooFew;
          this.valid = false;
          return [];
        }

        // 重みなしの場合, 0 or 1 のみを許す
        if (!this.weighted) {
          for (let i = 1; i < arr.length; i++) {
            if (!(arr[i] === 0 || arr[i] === 1)) {
              this.errorMessage = this.$tl.errors.zeroOne;
              this.valid = false;
              return [];
            }
          }
        }

        // 無向グラフの場合, 対称行列のみを許す
        if (!this.directed) {
          for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= n; j++) {
              let ii = j;
              let jj = i;
              let idx1 = (i - 1) * n + j;
              let idx2 = (ii - 1) * n + jj;
              if (arr[idx1] != arr[idx2]) {
                this.errorMessage = this.$tl.errors.symmetric;
                this.valid = false;
                return [];
              }
            }
          }
        }
      } else {

        // AtCoder 形式

        // 入力の長さは 2 以上が必要
        if (arr.length < 2) {
          // 頂点数 1 の木構造なら例外
          if (arr.length === 1 && arr[0] === 1) {
            arr.push(0);
          } else {
            this.errorMessage = this.$tl.errors.tooFew;
            this.valid = false;
            return [];
          }
        }

        let n = arr[0];

        // M が省略されているか自動検出（木に限らず任意のグラフに対応）
        const edgeWidth = this.weighted ? 3 : 2;
        const normalExpectedLen = 2 + arr[1] * edgeWidth; // N M edges... 形式
        const remainingFitsEdges = (arr.length - 1) % edgeWidth === 0; // N edges... 形式
        if (arr.length !== normalExpectedLen && remainingFitsEdges) {
          const inferredM = (arr.length - 1) / edgeWidth;
          let tmp = [arr[0], inferredM];
          for (let i = 1; i < arr.length; i++) tmp.push(arr[i]);
          arr = tmp;
        }

        let m = arr[1];

        // M が非負整数かチェック
        if (!Number.isInteger(m) || m < 0) {
          this.errorMessage = this.$tl.errors.nonInteger;
          this.valid = false;
          return [];
        }

        // 必要な数だけ入力があるかどうか
        if (this.weighted) {
          if (3 * m + 2 > arr.length) {
            this.errorMessage = this.$tl.errors.tooFew;
            this.valid = false;
            return [];
          }
          if (3 * m + 2 < arr.length) {
            this.errorMessage = this.$tl.errors.tooMany;
            this.valid = false;
            return [];
          }
        } else {
          if (2 * m + 2 > arr.length) {
            this.errorMessage = this.$tl.errors.tooFew;
            this.valid = false;
            return [];
          }
          if (2 * m + 2 < arr.length) {
            this.errorMessage = this.$tl.errors.tooMany;
            this.valid = false;
            return [];
          }
        }

        // 存在しない頂点を指定したらダメ
        for (let i = 0; i < m; i++) {
          let a;
          let b;
          if (this.weighted) {
            a = arr[i * 3 + 2];
            b = arr[i * 3 + 3];
          } else {
            a = arr[i * 2 + 2];
            b = arr[i * 2 + 3];
          }

          if (this.indexed) {
            a--;
            b--;
          }

          if (a < 0 || b < 0 || n <= a || n <= b) {
            this.errorMessage = this.$tl.errors.invalidVertex;
            this.valid = false;
            return [];
          }
        }
      }
      return arr;
    },

    // 入力を読み込んで, V, E, adjList にセットする
    readInput: function () {

      if (this.inputText === "") {
        this.inputText = this.placeHolder;
      }

      // 改行文字と空白文字で分解
      let arr = this.inputText.split(/\s|\n/).filter(n => n !== "").map(n => parseFloat(n));

      // 妥当性判定
      arr = this.validator(arr);
      if (!this.valid) return;

      this.V = arr[0];
      this.E = arr[1];
      this.adjList = new Array(this.V);
      for (let i = 0; i < this.V; i++) this.adjList[i] = new Array(0);

      if (!this.format) {
        // 隣接行列
        for (let i = 0; i < this.V; i++) {
          for (let j = 0; j < this.V; j++) {
            let idx = i * this.V + j + 1;
            if (arr[idx] == 0) continue;
            let a = i;
            let b = j;
            let c = arr[idx];
            this.adjList[a].push(new Pair(b, c));
          }
        }
      } else {
        // AtCoder 形式
        if (this.weighted) {
          // 重み付き
          for (let i = 0; i < this.E; i++) {
            let a = arr[i * 3 + 2];
            let b = arr[i * 3 + 3];
            let c = arr[i * 3 + 4];
            if (this.indexed) {
              a--;
              b--;
            }

            this.adjList[a].push(new Pair(b, c));
            if (!this.directed) this.adjList[b].push(new Pair(a, c));
          }
        } else {
          // 重みなし
          for (let i = 0; i < this.E; i++) {
            let a = arr[i * 2 + 2];
            let b = arr[i * 2 + 3];
            let c = 1;
            if (this.indexed) {
              a--;
              b--;
            }

            this.adjList[a].push(new Pair(b, c));
            if (!this.directed) this.adjList[b].push(new Pair(a, c));
          }
        }
      }
    },
    // adjList から を visの情報に変換
    setVis: function () {
      this.nodeList = [];
      this.edgeList = [];

      for (let i = 0; i < this.V; i++) {
        let lab;
        if (this.indexed) {
          lab = String(i + 1);
          if (i + 1 < 10) lab = ' ' + lab + ' ';
        } else {
          lab = String(i);
          if (i < 10) lab = ' ' + lab + ' ';
        }
        this.nodeList.push({id: i, label: lab});
      }

      let edgeId = 0;
      for (let i = 0; i < this.V; i++) {
        for (let j = 0; j < this.adjList[i].length; j++) {
          let a = i, b = this.adjList[i][j].first, c = this.adjList[i][j].second;
          let type;
          if (this.directed) type = 'to';
          else {
            if (a > b) continue;
            type = 'with';
          }
          if (this.weighted) this.edgeList.push({id: edgeId++, from: a, to: b, label: String(c), arrows: type});
          else this.edgeList.push({id: edgeId++, from: a, to: b, arrows: type});
        }
      }
    },
    visualize: function () {
      this.isLoading = true;
      this._nodes = new vis.DataSet(this.nodeList);
      this._edges = new vis.DataSet(this.edgeList);
      const container = document.getElementById('network');
      const options = {
        edges: { smooth: this.isSmooth },
      };
      if (this._network) this._network.destroy();
      this._network = new vis.Network(container, {nodes: this._nodes, edges: this._edges}, options);
      this._network.once('afterDrawing', () => { this.isLoading = false; });
    },
    execute: function () {
      this.readInput();
      if (!this.valid) return;
      this.setVis();
      this.computeGraphInfo();
      this.visualize();
      this.spResult = null; this.spNoPath = false; this.spAllDists = null; this.vizMode = null;
      this.isRootedTreeMode = false; this.rootNode = '';
      this.saveHistory();
    },
    // ── 最短経路 ────────────────────────────────────────
    findAndHighlightPath: function () {
      if (!this._nodes || !this._edges || this.V === 0) return;
      const from = this.indexed ? this.spFrom - 1 : +this.spFrom;
      if (isNaN(from) || from < 0 || from >= this.V) return;

      this.resetColors();
      this.vizMode = null;
      this.spResult = null; this.spNoPath = false; this.spPath = [];

      // 終点が未入力 → 全頂点への距離配列モード
      if (this.spTo === '' || this.spTo === null || this.spTo === undefined) {
        const dists = this.weighted ? this.dijkstraAll(from) : this.bfsAll(from);
        this.spAllDists = dists.map((d, i) => ({
          v: this.indexed ? i + 1 : i,
          d: d === Infinity ? '∞' : d,
          reachable: d !== Infinity,
          isFrom: i === from,
        }));
        this._nodes.update([{id: from, color: {background: '#4fc3f7', border: '#0288d1'}}]);
        return;
      }

      // 終点あり → 従来の1対1経路モード
      this.spAllDists = null;
      const to = this.indexed ? this.spTo - 1 : +this.spTo;
      if (isNaN(to) || to < 0 || to >= this.V) return;
      const result = this.weighted ? this.dijkstra(from, to) : this.bfsPath(from, to);
      if (!result) { this.spNoPath = true; return; }
      this.spResult = result.dist;
      this.spPath = result.path.map(v => this.indexed ? v + 1 : v);
      this._nodes.update([
        {id: from, color: {background: '#4fc3f7', border: '#0288d1'}},
        {id: to,   color: {background: '#ef5350', border: '#c62828'}},
      ]);
      for (let i = 0; i < result.path.length - 1; i++) {
        const u = result.path[i], v = result.path[i + 1];
        const e = this.edgeList.find(e => this.directed ? (e.from === u && e.to === v) : ((e.from === u && e.to === v) || (e.from === v && e.to === u)));
        if (e !== undefined) this._edges.update([{id: e.id, color: {color: '#3949ab', highlight: '#3949ab'}, width: 3}]);
      }
    },
    resetPath: function () {
      this.spResult = null; this.spNoPath = false; this.spPath = []; this.spAllDists = null;
      this.resetColors();
    },
    dijkstraAll: function (start) {
      const dist = new Array(this.V).fill(Infinity);
      dist[start] = 0;
      const pq = [[0, start]];
      while (pq.length) {
        pq.sort((a, b) => a[0] - b[0]);
        const [d, v] = pq.shift();
        if (d > dist[v]) continue;
        for (const p of this.adjList[v]) {
          const nd = dist[v] + p.second;
          if (nd < dist[p.first]) { dist[p.first] = nd; pq.push([nd, p.first]); }
        }
      }
      return dist;
    },
    bfsAll: function (start) {
      const dist = new Array(this.V).fill(-1);
      dist[start] = 0;
      const q = [start]; let qi = 0;
      while (qi < q.length) {
        const v = q[qi++];
        for (const p of this.adjList[v]) {
          if (dist[p.first] === -1) { dist[p.first] = dist[v] + 1; q.push(p.first); }
        }
      }
      return dist.map(d => d === -1 ? Infinity : d);
    },
    dijkstra: function (start, end) {
      const dist = new Array(this.V).fill(Infinity), prev = new Array(this.V).fill(-1);
      dist[start] = 0;
      const pq = [[0, start]];
      while (pq.length) {
        pq.sort((a, b) => a[0] - b[0]);
        const [d, v] = pq.shift();
        if (d > dist[v]) continue;
        for (const p of this.adjList[v]) {
          const nd = dist[v] + p.second;
          if (nd < dist[p.first]) { dist[p.first] = nd; prev[p.first] = v; pq.push([nd, p.first]); }
        }
      }
      if (dist[end] === Infinity) return null;
      const path = []; let cur = end;
      while (cur !== -1) { path.unshift(cur); cur = prev[cur]; }
      return {path, dist: dist[end]};
    },
    bfsPath: function (start, end) {
      const dist = new Array(this.V).fill(-1), prev = new Array(this.V).fill(-1);
      dist[start] = 0; const q = [start]; let qi = 0;
      while (qi < q.length) {
        const v = q[qi++]; if (v === end) break;
        for (const p of this.adjList[v]) {
          if (dist[p.first] === -1) { dist[p.first] = dist[v] + 1; prev[p.first] = v; q.push(p.first); }
        }
      }
      if (dist[end] === -1) return null;
      const path = []; let cur = end;
      while (cur !== -1) { path.unshift(cur); cur = prev[cur]; }
      return {path, dist: dist[end]};
    },
    resetColors: function () {
      if (!this._nodes || !this._edges) return;
      this._nodes.update(this.nodeList.map(n => ({id: n.id, color: undefined})));
      this._edges.update(this.edgeList.map(e => ({id: e.id, color: undefined, width: undefined})));
    },
    toggleViz: function (mode) {
      this.resetColors();
      this.spResult = null; this.spNoPath = false; this.spPath = []; this.spAllDists = null;
      if (mode === this.vizMode || mode === null) { this.vizMode = null; return; }
      this.vizMode = mode;
      if (mode === 'components') this.colorComponents();
      else if (mode === 'bipartite') this.colorBipartite();
      else if (mode === 'mst') this.showMST();
    },
    colorComponents: function () {
      const PALETTE = [
        {background: '#ef9a9a', border: '#c62828'},
        {background: '#90caf9', border: '#1565c0'},
        {background: '#a5d6a7', border: '#2e7d32'},
        {background: '#ffe082', border: '#f57f17'},
        {background: '#ce93d8', border: '#6a1b9a'},
        {background: '#80cbc4', border: '#004d40'},
        {background: '#ffab91', border: '#bf360c'},
        {background: '#bcaaa4', border: '#3e2723'},
      ];
      const updates = this.nodeList.map(n => ({
        id: n.id,
        color: PALETTE[this.graphInfo.componentOf[n.id] % PALETTE.length],
      }));
      this._nodes.update(updates);
    },
    colorBipartite: function () {
      const C = [
        {background: '#90caf9', border: '#1565c0'},
        {background: '#ffcc80', border: '#e65100'},
      ];
      const updates = this.nodeList.map(n => ({
        id: n.id,
        color: C[this.graphInfo.bipartiteColorOf[n.id]] || undefined,
      }));
      this._nodes.update(updates);
    },
    showMST: function () {
      // Kruskal (Union-Find)
      const parent = Array.from({length: this.V}, (_, i) => i);
      const rank = new Array(this.V).fill(0);
      const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
      const unite = (x, y) => {
        x = find(x); y = find(y);
        if (x === y) return false;
        if (rank[x] < rank[y]) [x, y] = [y, x];
        parent[y] = x;
        if (rank[x] === rank[y]) rank[x]++;
        return true;
      };
      // 辺を重み順にソート
      const sorted = [...this.edgeList].sort((a, b) => {
        const wa = this.weighted ? parseFloat(a.label) : 1;
        const wb = this.weighted ? parseFloat(b.label) : 1;
        return wa - wb;
      });
      const mstEdgeIds = new Set();
      for (const e of sorted) {
        if (unite(e.from, e.to)) mstEdgeIds.add(e.id);
      }
      this._edges.update(this.edgeList.map(e => mstEdgeIds.has(e.id)
        ? {id: e.id, color: {color: '#43a047', highlight: '#43a047'}, width: 3}
        : {id: e.id, color: {color: '#bdbdbd', highlight: '#bdbdbd'}, width: 1}
      ));
    },
    showRootedTree: function () {
      const base = this.indexed ? 1 : 0;
      const r = this.rootNode;
      if (r === '' || r === undefined) return;
      const rootIdx = r - base;
      if (rootIdx < 0 || rootIdx >= this.V) return;

      // BFS で親子関係を求め、各ノードの深さ (level) を計算
      const parent = new Array(this.V).fill(-1);
      const level = new Array(this.V).fill(-1);
      const visited = new Array(this.V).fill(false);
      const queue = [rootIdx];
      visited[rootIdx] = true;
      level[rootIdx] = 0;

      while (queue.length > 0) {
        const u = queue.shift();
        for (const pair of this.adjList[u]) {
          const v = pair.first;
          if (!visited[v]) {
            visited[v] = true;
            parent[v] = u;
            level[v] = level[u] + 1;
            queue.push(v);
          }
        }
      }

      // ノードに level を付与、根をハイライト
      const nodeUpdates = this.nodeList.map(n => ({
        id: n.id,
        label: n.label,
        level: level[n.id] >= 0 ? level[n.id] : undefined,
        color: n.id === rootIdx
          ? { background: '#ef5350', border: '#b71c1c' }
          : undefined,
      }));

      // 辺を親→子方向の矢印に変換
      const edgeUpdates = this.edgeList.map(e => {
        const from = parent[e.to] === e.from ? e.from : e.to;
        const to = from === e.from ? e.to : e.from;
        return {
          id: e.id,
          from: from,
          to: to,
          arrows: 'to',
          label: e.label,
        };
      });

      // 階層レイアウトで再描画
      if (this._network) this._network.destroy();
      this._nodes = new vis.DataSet(nodeUpdates);
      this._edges = new vis.DataSet(edgeUpdates);
      const container = document.getElementById('network');
      const options = {
        edges: { smooth: { type: 'cubicBezier' } },
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
      };
      this._network = new vis.Network(container, { nodes: this._nodes, edges: this._edges }, options);
      this.isRootedTreeMode = true;
    },
    resetRootedTree: function () {
      this.isRootedTreeMode = false;
      this.setVis();
      this.visualize();
    },
    computeGraphInfo: function () {
      const V = this.V;
      const actualEdges = this.edgeList.length;

      // 弱連結成分数を BFS で計算（有向グラフも無向として扱う）
      const undirAdj = Array.from({length: V}, () => []);
      for (let i = 0; i < V; i++) {
        for (const pair of this.adjList[i]) {
          undirAdj[i].push(pair.first);
          undirAdj[pair.first].push(i);
        }
      }
      const componentOf = new Array(V).fill(-1);
      let components = 0;
      for (let i = 0; i < V; i++) {
        if (componentOf[i] === -1) {
          const cIdx = components++;
          const q = [i]; componentOf[i] = cIdx; let qi = 0;
          while (qi < q.length) {
            const v = q[qi++];
            for (const nb of undirAdj[v]) { if (componentOf[nb] === -1) { componentOf[nb] = cIdx; q.push(nb); } }
          }
        }
      }

      // 無向グラフの構造判定
      const isTree   = !this.directed && actualEdges === V - 1 && components === 1;
      const isForest = !this.directed && actualEdges === V - components && components > 1;
      const isComplete = !this.directed && actualEdges === V * (V - 1) / 2;

      // 二部グラフ判定（無向グラフ, BFS 2色塗り）
      let isBipartite = false;
      const bipartiteColorOf = new Array(V).fill(-1);
      if (!this.directed) {
        let ok = true;
        for (let s = 0; s < V && ok; s++) {
          if (bipartiteColorOf[s] !== -1) continue;
          bipartiteColorOf[s] = 0;
          const q = [s]; let qi = 0;
          while (qi < q.length && ok) {
            const v = q[qi++];
            for (const nb of undirAdj[v]) {
              if (bipartiteColorOf[nb] === -1) { bipartiteColorOf[nb] = 1 - bipartiteColorOf[v]; q.push(nb); }
              else if (bipartiteColorOf[nb] === bipartiteColorOf[v]) ok = false;
            }
          }
        }
        isBipartite = ok && !isComplete;
      }

      // 有向グラフ: Kosaraju で SCC 計算
      let sccCount = 0, isDAG = false, isStronglyConnected = false, topoOrder = null;
      if (this.directed) {
        const fin1 = new Array(V).fill(false);
        const order = [];
        for (let s = 0; s < V; s++) {
          if (fin1[s]) continue;
          const stk = [[s, 0]]; fin1[s] = true;
          while (stk.length) {
            const [v, idx] = stk[stk.length - 1];
            if (idx < this.adjList[v].length) {
              stk[stk.length - 1][1]++;
              const nb = this.adjList[v][idx].first;
              if (!fin1[nb]) { fin1[nb] = true; stk.push([nb, 0]); }
            } else { stk.pop(); order.push(v); }
          }
        }
        const revAdj = Array.from({length: V}, () => []);
        for (let i = 0; i < V; i++) {
          for (const pair of this.adjList[i]) revAdj[pair.first].push(i);
        }
        const fin2 = new Array(V).fill(false);
        for (let i = order.length - 1; i >= 0; i--) {
          if (fin2[order[i]]) continue;
          sccCount++;
          const stk = [order[i]]; fin2[order[i]] = true;
          while (stk.length) {
            const v = stk.pop();
            for (const nb of revAdj[v]) { if (!fin2[nb]) { fin2[nb] = true; stk.push(nb); } }
          }
        }
        isDAG = sccCount === V;
        isStronglyConnected = sccCount === 1;

        if (isDAG) {
          const inDeg = new Array(V).fill(0);
          for (let i = 0; i < V; i++) for (const pair of this.adjList[i]) inDeg[pair.first]++;
          const q = []; let qi = 0;
          for (let i = 0; i < V; i++) { if (inDeg[i] === 0) q.push(i); }
          const topo = [];
          while (qi < q.length) {
            const v = q[qi++];
            topo.push(this.indexed ? v + 1 : v);
            for (const pair of this.adjList[v]) { if (--inDeg[pair.first] === 0) q.push(pair.first); }
          }
          topoOrder = topo;
        }
      }

      this.graphInfo = {
        visible: true, vertices: V, edges: actualEdges,
        directed: this.directed, components, sccCount,
        isTree, isForest, isComplete, isBipartite,
        isDAG, isStronglyConnected, topoOrder,
        componentOf, bipartiteColorOf,
      };
    },
    generatePreset: function (type) {
      const ri  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const shf = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = ri(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
      switch (type) {
        case 'star': {
          const N = ri(8, 14);
          const lines = [`${N} ${N - 1}`];
          for (let i = 2; i <= N; i++) lines.push(`1 ${i}`);
          return { text: lines.join('\n'), format: true, directed: false, weighted: false, indexed: true };
        }
        case 'path': {
          const N = ri(8, 14);
          const lines = [`${N} ${N - 1}`];
          for (let i = 1; i < N; i++) lines.push(`${i} ${i + 1}`);
          return { text: lines.join('\n'), format: true, directed: false, weighted: false, indexed: true };
        }
        case 'cycle': {
          const N = ri(8, 14);
          const lines = [`${N} ${N}`];
          for (let i = 1; i < N; i++) lines.push(`${i} ${i + 1}`);
          lines.push(`${N} 1`);
          return { text: lines.join('\n'), format: true, directed: false, weighted: false, indexed: true };
        }
        case 'complete': {
          const N = ri(5, 7);
          const edges = [];
          for (let i = 1; i <= N; i++) for (let j = i + 1; j <= N; j++) edges.push(`${i} ${j}`);
          return { text: [`${N} ${edges.length}`, ...edges].join('\n'), format: true, directed: false, weighted: false, indexed: true };
        }
        case 'bipartite': {
          const A = ri(4, 6), B = ri(4, 6), N = A + B;
          const edges = [];
          for (let i = 1; i <= A; i++)
            for (let j = A + 1; j <= N; j++)
              if (Math.random() < 0.45) edges.push(`${i} ${j}`);
          if (edges.length === 0) edges.push(`1 ${A + 1}`);
          return { text: [`${N} ${edges.length}`, ...edges].join('\n'), format: true, directed: false, weighted: false, indexed: true };
        }
        case 'weighted-tree': {
          const N = ri(8, 13);
          const perm = shf([...Array(N).keys()].map(i => i + 1));
          const edges = [];
          for (let i = 1; i < N; i++) {
            const u = perm[i], v = perm[ri(0, i - 1)], w = ri(1, 20);
            edges.push(`${u} ${v} ${w}`);
          }
          return { text: [`${N} ${edges.length}`, ...edges].join('\n'), format: true, directed: false, weighted: true, indexed: true };
        }
        case 'weighted-graph': {
          const N = ri(7, 11);
          const edges = [];
          for (let i = 1; i <= N; i++)
            for (let j = i + 1; j <= N; j++)
              if (Math.random() < 0.35) edges.push(`${i} ${j} ${ri(1, 20)}`);
          if (edges.length === 0) edges.push(`1 2 ${ri(1, 20)}`);
          return { text: [`${N} ${edges.length}`, ...edges].join('\n'), format: true, directed: false, weighted: true, indexed: true };
        }
        case 'dag': {
          const N = ri(8, 13);
          const perm = shf([...Array(N).keys()].map(i => i + 1));
          const edges = [];
          for (let i = 0; i < N; i++)
            for (let j = i + 1; j < N; j++)
              if (Math.random() < 0.28) edges.push(`${perm[i]} ${perm[j]}`);
          if (edges.length === 0) edges.push(`${perm[0]} ${perm[1]}`);
          return { text: [`${N} ${edges.length}`, ...edges].join('\n'), format: true, directed: true, weighted: false, indexed: true };
        }
        // ── おもしろグラフ ──
        case 'big-star': {
          const N = 200;
          const lines = [`${N} ${N - 1}`];
          for (let i = 2; i <= N; i++) lines.push(`1 ${i}`);
          return { text: lines.join('\n'), format: true, directed: false, weighted: false, indexed: true };
        }
        case 'grid': {
          const R = 32, C = 32, N = R * C;
          const id = (r, c) => r * C + c + 1;
          const edges = [];
          for (let r = 0; r < R; r++) {
            for (let c = 0; c < C; c++) {
              if (c + 1 < C) edges.push(`${id(r, c)} ${id(r, c + 1)}`);
              if (r + 1 < R) edges.push(`${id(r, c)} ${id(r + 1, c)}`);
            }
          }
          return { text: [`${N} ${edges.length}`, ...edges].join('\n'), format: true, directed: false, weighted: false, indexed: true };
        }
        case 'clusters': {
          const K = 15, S = 50, N = K * S;
          const edges = [];
          for (let k = 0; k < K; k++) {
            const base = k * S + 1;
            for (let i = 0; i < S; i++) {
              for (let j = i + 1; j < S; j++) {
                if (Math.random() < 0.4) edges.push(`${base + i} ${base + j}`);
              }
            }
          }
          for (let k = 0; k < K - 1; k++) {
            const u = k * S + 1 + ri(0, S - 1);
            const v = (k + 1) * S + 1 + ri(0, S - 1);
            edges.push(`${u} ${v}`);
            if (Math.random() < 0.5) {
              const u2 = k * S + 1 + ri(0, S - 1);
              const v2 = (k + 1) * S + 1 + ri(0, S - 1);
              edges.push(`${u2} ${v2}`);
            }
          }
          return { text: [`${N} ${edges.length}`, ...edges].join('\n'), format: true, directed: false, weighted: false, indexed: true };
        }
        case 'double-ring': {
          const H = 30, N = H * 2;
          const edges = [];
          for (let i = 1; i <= H; i++) {
            edges.push(`${i} ${(i % H) + 1}`);
          }
          for (let i = 1; i <= H; i++) {
            edges.push(`${H + i} ${H + (i % H) + 1}`);
          }
          for (let i = 1; i <= H; i++) {
            if (i % 2 === 1) edges.push(`${i} ${H + i}`);
          }
          return { text: [`${N} ${edges.length}`, ...edges].join('\n'), format: true, directed: false, weighted: false, indexed: true };
        }
        case 'binary-tree': {
          const N = 127;
          const edges = [];
          for (let i = 1; i <= N; i++) {
            if (2 * i <= N) edges.push(`${i} ${2 * i}`);
            if (2 * i + 1 <= N) edges.push(`${i} ${2 * i + 1}`);
          }
          return { text: [`${N} ${edges.length}`, ...edges].join('\n'), format: true, directed: false, weighted: false, indexed: true };
        }
        case 'caterpillar': {
          const spine = 40;
          let nextId = spine + 1;
          const edges = [];
          for (let i = 1; i < spine; i++) edges.push(`${i} ${i + 1}`);
          for (let i = 1; i <= spine; i++) {
            const leaves = ri(3, 10);
            for (let j = 0; j < leaves; j++) {
              edges.push(`${i} ${nextId}`);
              nextId++;
            }
          }
          const N = nextId - 1;
          return { text: [`${N} ${edges.length}`, ...edges].join('\n'), format: true, directed: false, weighted: false, indexed: true };
        }
        case 'jellyfish': {
          // 密な頭部 + 長い触手
          const headSize = 30;
          const tentacles = 12;
          const tentacleLen = ri(15, 25);
          const edges = [];
          // 頭部: 密なランダムグラフ
          for (let i = 1; i <= headSize; i++) {
            for (let j = i + 1; j <= headSize; j++) {
              if (Math.random() < 0.5) edges.push(`${i} ${j}`);
            }
          }
          // 触手: 頭部のランダムな頂点から長いパスを伸ばす
          let nextId = headSize + 1;
          for (let t = 0; t < tentacles; t++) {
            const attach = ri(1, headSize);
            let prev = attach;
            const len = ri(tentacleLen - 5, tentacleLen + 5);
            for (let k = 0; k < len; k++) {
              edges.push(`${prev} ${nextId}`);
              // 触手の途中にランダムな枝分かれ
              if (Math.random() < 0.25 && k > 2) {
                const branch = nextId;
                nextId++;
                edges.push(`${branch} ${nextId}`);
                if (Math.random() < 0.4) { nextId++; edges.push(`${branch} ${nextId}`); }
              }
              prev = nextId;
              nextId++;
            }
          }
          const N = nextId - 1;
          return { text: [`${N} ${edges.length}`, ...edges].join('\n'), format: true, directed: false, weighted: false, indexed: true };
        }
        case 'spider-web': {
          // 同心円リング + 放射状スポーク
          const rings = 10;
          const spokes = 20;
          const N = rings * spokes + 1; // +1 for center
          const edges = [];
          const nodeId = (ring, spoke) => ring * spokes + (spoke % spokes) + 2; // 2-based (1 is center)
          // 中心から最内リングへ
          for (let s = 0; s < spokes; s++) {
            edges.push(`1 ${nodeId(0, s)}`);
          }
          // 各リング内の接続
          for (let r = 0; r < rings; r++) {
            for (let s = 0; s < spokes; s++) {
              edges.push(`${nodeId(r, s)} ${nodeId(r, s + 1)}`);
            }
          }
          // リング間のスポーク接続
          for (let r = 0; r < rings - 1; r++) {
            for (let s = 0; s < spokes; s++) {
              edges.push(`${nodeId(r, s)} ${nodeId(r + 1, s)}`);
            }
          }
          return { text: [`${N} ${edges.length}`, ...edges].join('\n'), format: true, directed: false, weighted: false, indexed: true };
        }
        case 'hairball': {
          // 超密なランダムグラフ
          const N = 300;
          const edges = [];
          for (let i = 1; i <= N; i++) {
            for (let j = i + 1; j <= N; j++) {
              if (Math.random() < 0.03) edges.push(`${i} ${j}`);
            }
          }
          return { text: [`${N} ${edges.length}`, ...edges].join('\n'), format: true, directed: false, weighted: false, indexed: true };
        }
        default: return null;
      }
    },
    loadPreset: function (preset) {
      const data = this.generatePreset(preset);
      if (!data) return;
      this.format   = data.format;
      this.directed = data.directed;
      this.weighted = data.weighted;
      this.indexed  = data.indexed;
      this.inputText = data.text;
      this.setPlaceHolder(data.format, data.directed, data.weighted, data.indexed);
      // watch は非同期発火なので $nextTick 内でキャンセルする
      this.$nextTick(() => {
        clearTimeout(this._debounceTimer);
        this.execute();
      });
    },
    exportURL: function () {
      let inputData = this.inputText === "" ? this.placeHolder : this.inputText;

      // URLパラメータを構築（URLSearchParams のネイティブエンコードを使用）
      let params = new URLSearchParams();
      params.set('format', this.format.toString());
      params.set('indexed', this.indexed.toString());
      params.set('weighted', this.weighted.toString());
      params.set('directed', this.directed.toString());
      params.set('data', inputData);
      
      // 完全なURLを生成
      let baseURL = window.location.origin + window.location.pathname;
      let exportURL = baseURL + '?' + params.toString();
      
      // クリップボードにコピー
      navigator.clipboard.writeText(exportURL).then(() => {
        this.showToast(this.$tl.toast.urlCopied);
      }).catch(() => {
        this.showToast(this.$tl.toast.copyFailed);
      });
      
      return exportURL;
    },
    generateRandom: function () {
      const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const wMin = (this.randomWMin > 0) ? this.randomWMin : 1;
      const wMax = (this.randomWMax > 0) ? Math.max(this.randomWMax, wMin) : 100;
      const rw = () => ri(wMin, wMax);
      const base = this.indexed ? 1 : 0;
      const type = this.randomType || 'random';
      const shf = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = ri(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };

      // dag を選択した場合は directed に自動切り替え
      if (type === 'dag' && !this.directed) {
        this.directed = true;
        this.setPlaceHolder(this.format, true, this.weighted, this.indexed);
      }

      // 辺リストを normal 形式のテキストに変換するヘルパー
      const edgesToText = (N, edges) => {
        const E = edges.length;
        const lines = [`${N} ${E}`];
        for (const [a, b, w] of edges) {
          const u = a + base, v = b + base;
          lines.push(this.weighted ? `${u} ${v} ${w !== undefined ? w : rw()}` : `${u} ${v}`);
        }
        return lines.join('\n');
      };

      // 隣接行列形式のテキストに変換するヘルパー
      const matToText = (N, edges) => {
        const mat = Array.from({length: N}, () => new Array(N).fill(0));
        for (const [a, b, w] of edges) {
          const val = this.weighted ? (w !== undefined ? w : rw()) : 1;
          mat[a][b] = val;
          if (!this.directed) mat[b][a] = val;
        }
        const lines = [String(N)];
        for (let i = 0; i < N; i++) lines.push(mat[i].join(' '));
        return lines.join('\n');
      };

      const toText = (N, edges) => this.format ? edgesToText(N, edges) : matToText(N, edges);

      // ランダムスパニングツリーを生成（0-indexed）
      const randomTree = (N) => {
        const edges = [];
        const perm = shf(Array.from({length: N}, (_, i) => i));
        for (let i = 1; i < N; i++) {
          const parent = perm[ri(0, i - 1)];
          edges.push([perm[i], parent]);
        }
        return edges;
      };

      const maxN = this.maxRandomN;
      let N, edges;

      switch (type) {
        case 'tree': {
          N = (this.randomN > 0) ? Math.min(this.randomN, maxN) : ri(5, 12);
          edges = randomTree(N);
          break;
        }
        case 'connected': {
          N = (this.randomN > 0) ? Math.min(this.randomN, maxN) : ri(5, 12);
          // スパニングツリー + ランダム辺
          const treeEdges = randomTree(N);
          const treeSet = new Set();
          for (const [a, b] of treeEdges) {
            const u = Math.min(a, b), v = Math.max(a, b);
            treeSet.add(this.directed ? `${a},${b}` : `${u},${v}`);
          }
          const maxE = this.directed ? N * (N - 1) : N * (N - 1) / 2;
          const targetE = (this.randomE >= 0 && this.randomE !== '') ?
            Math.max(Math.min(this.randomE, maxE), N - 1) :
            ri(N - 1, Math.min(maxE, N + 5));
          const extra = [];
          for (let i = 0; i < N; i++) {
            for (let j = this.directed ? 0 : i + 1; j < N; j++) {
              if (i === j) continue;
              const key = this.directed ? `${i},${j}` : `${Math.min(i,j)},${Math.max(i,j)}`;
              if (!treeSet.has(key)) extra.push([i, j]);
            }
          }
          shf(extra);
          const additionalCount = Math.min(targetE - treeEdges.length, extra.length);
          edges = treeEdges.concat(extra.slice(0, Math.max(0, additionalCount)));
          shf(edges);
          break;
        }
        case 'bipartite': {
          N = (this.randomN > 0) ? Math.min(this.randomN, maxN) : ri(6, 12);
          const A = Math.floor(N / 2);
          const B = N - A;
          const maxE = A * B;
          const targetE = (this.randomE >= 0 && this.randomE !== '') ?
            Math.min(this.randomE, maxE) :
            ri(Math.max(1, Math.floor(maxE * 0.3)), Math.min(maxE, A + B + 3));
          const candidates = [];
          for (let i = 0; i < A; i++) {
            for (let j = A; j < N; j++) {
              candidates.push([i, j]);
            }
          }
          shf(candidates);
          edges = candidates.slice(0, Math.min(targetE, candidates.length));
          if (edges.length === 0 && N >= 2) edges.push([0, A]);
          break;
        }
        case 'dag': {
          N = (this.randomN > 0) ? Math.min(this.randomN, maxN) : ri(5, 12);
          const perm = shf(Array.from({length: N}, (_, i) => i));
          edges = [];
          for (let i = 0; i < N; i++) {
            for (let j = i + 1; j < N; j++) {
              if (Math.random() < 0.28) {
                edges.push([perm[i], perm[j]]);
              }
            }
          }
          if (edges.length === 0 && N >= 2) edges.push([perm[0], perm[1]]);
          break;
        }
        case 'complete': {
          N = (this.randomN > 0) ? Math.min(this.randomN, maxN) : ri(4, 7);
          edges = [];
          for (let i = 0; i < N; i++) {
            for (let j = this.directed ? 0 : i + 1; j < N; j++) {
              if (i !== j) edges.push([i, j]);
            }
          }
          break;
        }
        case 'path': {
          N = (this.randomN > 0) ? Math.min(this.randomN, maxN) : ri(5, 14);
          edges = [];
          for (let i = 0; i < N - 1; i++) edges.push([i, i + 1]);
          break;
        }
        case 'cycle': {
          N = (this.randomN > 0) ? Math.min(this.randomN, maxN) : ri(5, 14);
          edges = [];
          for (let i = 0; i < N; i++) edges.push([i, (i + 1) % N]);
          break;
        }
        case 'star': {
          N = (this.randomN > 0) ? Math.min(this.randomN, maxN) : ri(5, 14);
          edges = [];
          for (let i = 1; i < N; i++) edges.push([0, i]);
          break;
        }
        case 'grid': {
          N = (this.randomN > 0) ? Math.min(this.randomN, maxN) : ri(9, 25);
          const cols = Math.max(1, Math.round(Math.sqrt(N)));
          const rows = Math.ceil(N / cols);
          const totalN = rows * cols;
          edges = [];
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const v = r * cols + c;
              if (c + 1 < cols) edges.push([v, v + 1]);
              if (r + 1 < rows) edges.push([v, v + cols]);
            }
          }
          N = totalN;
          break;
        }
        default: {
          // random（従来のロジック）
          if (!this.format) {
            const mN = (this.randomN > 0) ? Math.min(this.randomN, maxN) : ri(4, 8);
            const mat = Array.from({length: mN}, () => new Array(mN).fill(0));
            for (let i = 0; i < mN; i++) {
              for (let j = this.directed ? 0 : i + 1; j < mN; j++) {
                if (i === j) continue;
                if (Math.random() < 0.35) {
                  const w = this.weighted ? rw() : 1;
                  mat[i][j] = w;
                  if (!this.directed) mat[j][i] = w;
                }
              }
            }
            const lines = [String(mN)];
            for (let i = 0; i < mN; i++) lines.push(mat[i].join(' '));
            this.inputText = lines.join('\n');
            this.$nextTick(() => { clearTimeout(this._debounceTimer); this.execute(); });
            return;
          }
          N = (this.randomN > 0) ? Math.min(this.randomN, maxN) : ri(5, 12);
          const maxE = this.directed ? N * (N - 1) : N * (N - 1) / 2;
          const targetE = (this.randomE >= 0 && this.randomE !== '') ?
            Math.min(this.randomE, maxE) :
            ri(N - 1, Math.min(maxE, N + 5));
          const candidates = [];
          for (let i = 0; i < N; i++) {
            for (let j = this.directed ? 0 : i + 1; j < N; j++) {
              if (i !== j) candidates.push([i, j]);
            }
          }
          shf(candidates);
          edges = candidates.slice(0, Math.min(targetE, candidates.length));
          break;
        }
      }

      this.inputText = toText(N, edges);
      this.$nextTick(() => {
        clearTimeout(this._debounceTimer);
        this.execute();
      });
    },
    saveHistory: function () {
      const text = this.inputText;
      if (!text || !text.trim()) return;
      // 直前と同じなら保存しない
      if (this.graphHistory.length > 0 && this.graphHistory[0].text === text) return;
      const entry = {
        text: text,
        format: this.format,
        directed: this.directed,
        weighted: this.weighted,
        indexed: this.indexed,
        timestamp: Date.now(),
        vertices: this.graphInfo.vertices || this.V,
        edges: this.graphInfo.edges || this.E,
      };
      this.graphHistory.unshift(entry);
      if (this.graphHistory.length > 20) this.graphHistory = this.graphHistory.slice(0, 20);
      try { localStorage.setItem('graphHistory', JSON.stringify(this.graphHistory)); } catch(e) {}
    },
    loadHistory: function () {
      try {
        const data = localStorage.getItem('graphHistory');
        if (data) this.graphHistory = JSON.parse(data);
      } catch(e) { this.graphHistory = []; }
    },
    restoreHistory: function (index) {
      const entry = this.graphHistory[index];
      if (!entry) return;
      this.format = entry.format;
      this.directed = entry.directed;
      this.weighted = entry.weighted;
      this.indexed = entry.indexed;
      this.inputText = entry.text;
      this.setPlaceHolder(entry.format, entry.directed, entry.weighted, entry.indexed);
      this.$nextTick(() => { clearTimeout(this._debounceTimer); this.execute(); });
    },
    clearHistory: function () {
      this.graphHistory = [];
      try { localStorage.removeItem('graphHistory'); } catch(e) {}
    },
    formatHistoryTime: function (ts) {
      const d = new Date(ts);
      return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    },
    copyInput: function () {
      if (!this.inputText) return;
      navigator.clipboard.writeText(this.inputText).then(() => {
        this.showToast(this.$tl.toast.inputCopied);
      }).catch(() => {
        this.showToast(this.$tl.toast.copyFailed);
      });
    },
    pushUndo: function (text) {
      if (this._isUndoRedo) return;
      this.undoStack.push(text);
      if (this.undoStack.length > 50) this.undoStack.shift();
      this.redoStack = [];
    },
    undoInput: function () {
      if (this.undoStack.length === 0) return;
      this._isUndoRedo = true;
      this.redoStack.push(this.inputText);
      this.inputText = this.undoStack.pop();
      this.$nextTick(() => { this._isUndoRedo = false; });
    },
    redoInput: function () {
      if (this.redoStack.length === 0) return;
      this._isUndoRedo = true;
      this.undoStack.push(this.inputText);
      this.inputText = this.redoStack.pop();
      this.$nextTick(() => { this._isUndoRedo = false; });
    },
    handleEditorKeydown: function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undoInput();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redoInput();
      }
    },
    showToast: function (message) {
      this.toastMessage = message;
      this.toastVisible = true;
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => { this.toastVisible = false; }, 2500);
    },
    syncLineNumbers: function () {
      const ta = document.getElementById('input_area');
      if (this.$refs.lineNumbers) {
        this.$refs.lineNumbers.scrollTop = ta.scrollTop;
      }
    },
    changeIsSmooth: function () {
      if (this.isSmooth == false) this.isSmooth = true;
      else this.isSmooth = false;
    },
  },
  watch: {
    inputText: function (val, oldVal) {
      if (oldVal !== undefined && oldVal !== '') {
        this.pushUndo(oldVal);
      }
      if (val === '') return;
      clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(() => { this.execute(); }, 500);
    },
    isSmooth: function () {
      if (this._network) this.visualize();
    }
  },
  mounted: function () {
    this.loadHistory();
    let param = location.search;
    if (param == "") {
      let container = document.getElementById("input_area");
      container.placeholder = "10 9\n1 2\n1 3\n1 4\n1 5\n1 6\n1 7\n1 8\n1 9\n1 10";
    } else {
      let paramFormat = getParam('format');
      let paramIndexed = getParam('indexed');
      let paramWeighted = getParam('weighted');
      let paramDirected = getParam('directed');
      let paramData = getParam('data');
      this.setPlaceHolder(paramFormat == 'true', paramDirected == 'true', paramWeighted == 'true', paramIndexed == 'true');
      this.inputText = paramData;
      this.execute();
    }
  }
})


Vue.component('about', {
  template: `
  <div id="about">
    <section class="about-section">
      <h2 class="about-h2">{{ $tl.about.whatTitle }}</h2>
      <p class="about-p" style="white-space: pre-line;">{{ $tl.about.whatBody }}</p>
    </section>

    <section class="about-section">
      <h2 class="about-h2">{{ $tl.about.featuresTitle }}</h2>
      <div class="about-features">
        <div class="about-feature-item" v-for="f in $tl.about.features" :key="f.title">
          <div class="about-feature-title">{{ f.title }}</div>
          <div class="about-feature-desc">{{ f.desc }}</div>
        </div>
      </div>
    </section>

    <section class="about-section">
      <h2 class="about-h2">{{ $tl.about.authorTitle }}</h2>
      <p class="about-p">
        <a href="https://twitter.com/monkukui" target="_blank">@monkukui</a> {{ $tl.about.authorBody1 }}<br>
        {{ $tl.about.authorBody2 }}
        <a href="https://twitter.com/monkukui/status/1413176697189400587" target="_blank">{{ $tl.about.authorBody3 }}</a>{{ $tl.about.authorBody4 }}
      </p>
    </section>

    <section class="about-section">
      <h2 class="about-h2">{{ $tl.about.techTitle }}</h2>
      <div class="about-tech-list">
        <span class="about-tech-badge" v-for="t in $tl.about.techs" :key="t.name">
          <strong>{{ t.name }}</strong><span class="about-tech-role"> — {{ t.role }}</span>
        </span>
      </div>
    </section>

    <section class="about-section">
      <h2 class="about-h2">{{ $tl.about.browserTitle }}</h2>
      <p class="about-p">{{ $tl.about.browserBody }}</p>
    </section>

    <section class="about-section">
      <h2 class="about-h2">{{ $tl.about.changelogTitle }}</h2>
      <div class="about-changelog">
        <div class="about-changelog-item" v-for="log in $tl.about.changelog" :key="log.version">
          <span class="about-version-badge">{{ log.version }}</span>
          <span class="about-changelog-desc">{{ log.desc }}</span>
        </div>
      </div>
    </section>
  </div>
  `,
})

Vue.component('privacy', {
  template: `
  <div id="privacy">
    <section class="about-section">
      <h2 class="about-h2">{{ $tl.privacy.title }}</h2>
      <p class="about-p">{{ $tl.privacy.intro }}</p>
    </section>

    <div class="privacy-card">
      <h2 class="about-h2">{{ $tl.privacy.adsTitle }}</h2>
      <p class="about-p">{{ $tl.privacy.adsBody }}</p>
    </div>

    <div class="privacy-card">
      <h2 class="about-h2">{{ $tl.privacy.analyticsTitle }}</h2>
      <p class="about-p">{{ $tl.privacy.analyticsBody }}</p>
    </div>

    <div class="privacy-card">
      <h2 class="about-h2">{{ $tl.privacy.cookieTitle }}</h2>
      <p class="about-p">{{ $tl.privacy.cookieBody }}</p>
    </div>

    <div class="privacy-card">
      <h2 class="about-h2">{{ $tl.privacy.disclaimerTitle }}</h2>
      <p class="about-p">{{ $tl.privacy.disclaimerBody }}</p>
    </div>

    <div class="privacy-card">
      <h2 class="about-h2">{{ $tl.privacy.copyrightTitle }}</h2>
      <p class="about-p">{{ $tl.privacy.copyrightBody }}</p>
    </div>

    <div class="privacy-card">
      <h2 class="about-h2">{{ $tl.privacy.changeTitle }}</h2>
      <p class="about-p">{{ $tl.privacy.changeBody }}</p>
    </div>

    <p class="about-p" style="color: var(--text-muted); font-size: 0.82rem; margin-top: 24px;">{{ $tl.privacy.lastUpdated }}</p>
  </div>
  `,
})

Vue.component('contact', {
  template: `
  <div id="contact">
    <section class="about-section">
      <h2 class="about-h2">{{ $tl.contact.title }}</h2>
      <p class="about-p">{{ $tl.contact.intro }}</p>
    </section>

    <div class="contact-card">
      <div class="contact-card-title">{{ $tl.contact.twitterTitle }}</div>
      <div class="contact-card-body">{{ $tl.contact.twitterBody }}</div>
      <a class="contact-link" href="https://twitter.com/monkukui" target="_blank">{{ $tl.contact.twitterLink }}</a>
    </div>

    <div class="contact-card">
      <div class="contact-card-title">{{ $tl.contact.githubTitle }}</div>
      <div class="contact-card-body">{{ $tl.contact.githubBody }}</div>
      <a class="contact-link" href="https://github.com/monkukui/graphgraph/issues" target="_blank">{{ $tl.contact.githubLink }}</a>
    </div>

    <p class="about-p" style="color: var(--text-muted); font-size: 0.82rem; margin-top: 24px;">{{ $tl.contact.note }}</p>
  </div>
  `,
})

Vue.component('index-content', {
  template: `
  <div id="index-content">
    <section class="about-section">
      <h2 class="about-h2">{{ $tl.indexContent.whatTitle }}</h2>
      <p class="about-p">{{ $tl.indexContent.whatBody }}</p>
    </section>

    <section class="about-section">
      <h2 class="about-h2">{{ $tl.indexContent.featuresTitle }}</h2>
      <div class="about-features">
        <div class="about-feature-item" v-for="f in $tl.indexContent.features" :key="f.title">
          <div class="about-feature-title">{{ f.title }}</div>
          <div class="about-feature-desc">{{ f.desc }}</div>
        </div>
      </div>
    </section>

    <section class="about-section">
      <h2 class="about-h2">{{ $tl.indexContent.howtoTitle }}</h2>
      <div class="howto-steps">
        <div class="howto-step" v-for="s in $tl.indexContent.steps" :key="s.num">
          <div class="howto-step-num">{{ s.num }}</div>
          <div>
            <div class="howto-step-title">{{ s.title }}</div>
            <div class="howto-step-desc">{{ s.desc }}</div>
          </div>
        </div>
      </div>
      <p class="about-p" style="margin-top: 12px;">
        <a href="howtouse.html">{{ $tl.indexContent.howtoMore }}</a>
      </p>
    </section>
  </div>
  `,
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
    message: function () {
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
  data: function () {
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
    turnFlag: function () {
      this.mathFlag = true;
    },
    execute: function () {

      MathJax.Hub.Typeset();
      this.mathFlag = false;
      this.format = this.lazyFormat;
      this.weighted = this.lazyWeighted;
      this.directed = this.lazyDirected;
      this.indexed = this.lazyIndexed;

      this.canDisplay = true;
      let edges;
      let nodes;
      if (this.indexed) {
        nodes = new vis.DataSet([
          {id: 0, label: ' 1 '},
          {id: 1, label: ' 2 '},
          {id: 2, label: ' 3 '},
          {id: 3, label: ' 4 '}
        ]);
      } else {
        nodes = new vis.DataSet([
          {id: 0, label: ' 0 '},
          {id: 1, label: ' 1 '},
          {id: 2, label: ' 2 '},
          {id: 3, label: ' 3 '}
        ]);
      }


      if (!this.weighted) {

        let arr;
        if (this.directed) arr = 'to';
        else arr = 'with';
        edges = new vis.DataSet([
          {from: 0, to: 1, arrows: arr},
          {from: 1, to: 2, arrows: arr},
          {from: 2, to: 3, arrows: arr},
          {from: 3, to: 1, arrows: arr},
        ]);
      }

      if (this.weighted) {

        let arr;
        if (this.directed) arr = 'to';
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
    mathFlag: function () {
      MathJax.Hub.Typeset();
    },
  }
})


Vue.component('howto', {
  template: `
  <div id="about">

    <section class="about-section">
      <h2 class="about-h2">{{ $tl.howto.basicTitle }}</h2>
      <div class="howto-steps">
        <div class="howto-step" v-for="(step, i) in $tl.howto.steps" :key="i">
          <div class="howto-step-num">{{ i + 1 }}</div>
          <div class="howto-step-body">
            <div class="howto-step-title">{{ step.title }}</div>
            <div class="howto-step-desc">{{ step.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="about-section">
      <h2 class="about-h2">{{ $tl.howto.formatTitle }}</h2>

      <h3 class="about-h3">{{ $tl.howto.normalTitle }}</h3>
      <p class="about-p">{{ $tl.howto.normalDesc }}</p>
      <div class="howto-example-row">
        <div class="howto-example-block">
          <div class="howto-example-label">{{ $tl.howto.normalLabels[0] }}</div>
          <pre class="howto-code">4 3
1 2
2 3
3 4</pre>
        </div>
        <div class="howto-example-block">
          <div class="howto-example-label">{{ $tl.howto.normalLabels[1] }}</div>
          <pre class="howto-code">4 3
1 2 5
2 3 3
3 4 8</pre>
        </div>
        <div class="howto-example-block">
          <div class="howto-example-label">{{ $tl.howto.normalLabels[2] }}</div>
          <pre class="howto-code">4
1 2
2 3
3 4</pre>
        </div>
      </div>

      <h3 class="about-h3">{{ $tl.howto.matrixTitle }}</h3>
      <p class="about-p">{{ $tl.howto.matrixDesc }}</p>
      <div class="howto-example-row">
        <div class="howto-example-block">
          <div class="howto-example-label">{{ $tl.howto.matrixLabels[0] }}</div>
          <pre class="howto-code">4
0 1 0 0
1 0 1 0
0 1 0 1
0 0 1 0</pre>
        </div>
        <div class="howto-example-block">
          <div class="howto-example-label">{{ $tl.howto.matrixLabels[1] }}</div>
          <pre class="howto-code">4
0 5 0 0
5 0 3 0
0 3 0 8
0 0 8 0</pre>
        </div>
      </div>
    </section>

    <section class="about-section">
      <h2 class="about-h2">{{ $tl.howto.featuresTitle }}</h2>
      <div class="howto-features">
        <div class="howto-feature-item" v-for="f in $tl.howto.features" :key="f.title">
          <div class="howto-feature-title">{{ f.title }}</div>
          <div class="howto-feature-desc">{{ f.desc }}</div>
        </div>
      </div>
    </section>

    <section class="about-section">
      <h2 class="about-h2">{{ $tl.howto.faqTitle }}</h2>
      <div class="howto-faq" v-for="faq in $tl.howto.faqs" :key="faq.q">
        <div class="howto-faq-q">Q. {{ faq.q }}</div>
        <div class="howto-faq-a">{{ faq.a }}</div>
      </div>
    </section>

  </div>
  `,
})


new Vue({
  el: '#app'

})
