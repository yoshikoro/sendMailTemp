/**
 * @description openイベント
 * @author yoshitaka <sato-yoshitaka@aktio.co.jp>
 * @date 2022-10-18
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu("メニュー");
  menu.addItem("メール送信", "sendEmailforEditors");

  menu.addToUi();
}
