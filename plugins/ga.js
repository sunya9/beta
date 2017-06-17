// from https://ja.nuxtjs.org/faq/google-analytics

/* eslint-disable */
import router from '~router'
/*
** クライアントサイドかつプロダクションモードでのみ実行
*/
if (process.env.NODE_ENV === 'production') {
  /*
  ** Google アナリティクスのスクリプトをインクルード
  */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  /*
  ** 現在のページをセット
  */
  ga('create', 'UA-10104011-16', 'auto')
  /*
  ** ルートが変更されるたびに毎回実行（初期化も実行される）
  */
  router.afterEach((to, from) => {
    /*
    ** Google アナリティクスにページビューが追加されたことを伝える
    */
    ga('set', 'page', to.fullPath)
    ga('send', 'pageview')
  })
}