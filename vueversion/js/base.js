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
    <img :src="image" alt="logo" width="333" height="192">
  `,
  data: function() {
    return {
      logoname: 'logo4'
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
    <div id="footer"><small>Copyright (c) monkukui All Right Reserved.</small></div>
  `,
})

new Vue({
  el: '#app'
})


