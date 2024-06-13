/**
 * @description メール処理
 * @author yoshitaka <sato-yoshitaka@aktio.co.jp>
 * @date 2022-10-15
 */
function sendEmailforEditors() {
  //config シートを作成してArrayの１なので２列目（A列は0 B列は1 C列が2）
  const CONFIGSHNAME = "config";
  //B列にメールアドレスがある想定
  const EMAILADRESSCOLUMN = 1;
  const sp = SpreadsheetApp.getActiveSpreadsheet();
  const sh = sp.getSheetByName(CONFIGSHNAME);
  const data = sh.getDataRange().getValues();
  const url = data[1][0];
  //see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
  // forEach は高階関数　Arrayのメソッドで関数を引数に取ります
  data.forEach((element, index) => {
    //ヘッダーはリターン
    if (index == 0) {
      return;
    }
    const emailAddress = element[EMAILADRESSCOLUMN];
    //空白がある場合を想定して空白以外を送信者配列へ
    if (emailAddress !== "") {
      sendMailCore(emailAddress, url);
    }
  });
}
/**
 * @description メール送信のcore部分
 * @author yoshitaka <sato-yoshitaka@aktio.co.jp>
 * @date 13/10/2022
 * @param {string} emailAddress
 * @param {string} url
 */
function sendMailCore(emailAddress: string, url: string) {
  const recipientTO = emailAddress;

  const dt: string = Utilities.formatDate(new Date(), "JST", "yyyyMMdd");
  //日付をメールのタイトルへ（よく使う感じかと）
  const subject: string = `${dt}〇〇〇`;
  //mailSend.html をテンプレートへ
  const outP: GoogleAppsScript.HTML.HtmlTemplate =
    HtmlService.createTemplateFromFile("mailSend");
  //mailSend.htmlに<?!=URL ?> このURLの部分を変数として扱う事ができる
  outP.URL = url;

  //mailSend.htmlに<?!=USER ?> このUSERの部分を変数として扱う事ができる
  outP.USER = emailAddress;
  //HtmlTemplateをevaluateしてdoGetの場合はそれをリターンですが
  //メールの場合はgetContentでHTML文字列として取得してそちらを
  const htmlObj: string = outP.evaluate().getContent();
  const options: GoogleAppsScript.Gmail.GmailAdvancedOptions = {
    htmlBody: htmlObj,
    noReply: false,
    /*, cc: recipientCC*/
  };
  //HTMLメールが受け取れないメーラの場合は下のbodyが表示される
  const body: string = "通常メール";
  //送信
  GmailApp.sendEmail(recipientTO, subject, body, options);
}
