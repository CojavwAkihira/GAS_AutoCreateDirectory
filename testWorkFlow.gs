//メインファンクション。フォームと関連付けています。
function testFormWorkFlow() {
  
  //Form Objectを取得
  var form = FormApp.getActiveForm();
  let formResponses = form.getResponses();

  // 回答データをいったんすべて取得
  let formEndRow = formResponses.length - 1;
  var itemResponses = formResponses[formEndRow].getItemResponses();
  
  //トリガー実行のため失敗時再送に必要なデータのキー情報としてTwitter IDだけログに出力する
    Logger.log('Response #%s to the question "%s" was "%s"',
        (1).toString(),
        itemResponses[0].getItem().getTitle(),
        itemResponses[0].getResponse());

  // キャラ持ちか判定するためQ2の回答を取得
  let isOwner = itemResponses[1].getResponse();

  if(isOwner == 'No') {
    // 一般参加者として返却
    return;
  }

  // twitterIDを取得
  let twitterId = itemResponses[0].getResponse();

  // キャラ名を取得
  let characterName = itemResponses[2].getResponse();

  // メールアドレスを取得
  let mailAddress = itemResponses[3].getResponse();

  // twitterIDとキャラ名を連結し、フォルダ名にする
  let directoryName = twitterId + ' - ' + characterName; 

  var link = '';

  // ディレクトリ作成関数に作成したフォルダ名を渡す、フォルダIDが返却される
  link = directoryCreate_googleDrive(directoryName);

  //メール送信関数に渡す
  mailSending(mailAddress, link);

}

// サブファンクション。
function directoryCreate_googleDrive(directoryName) {

  // フォルダを作成したいgoogleドライブのフォルダIDを指定
  //ex)~/drive/folders/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  const directoryId = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

  // フォルダを作成したいgoogleドライブを指定
  directory = DriveApp.getFolderById(directoryId);

  // キャラ名のフォルダ作成
  charaDirectory = directory.createFolder(directoryName);

  // 写真・動画フォルダ作成
  charaDirectory.createFolder('1_写真');
  charaDirectory.createFolder('2_動画');

  //フォルダIDを返却して当機能を終了
  return charaDirectory.getId();

  /* 仕上がりはこんなイメージ。
  *  ■ directoryIdで指定したフォルダ
  *  ├■ キャラ名のフォルダ
  *  │├■ 1_写真
  *  │└■ 2_動画
  *  ...
  */
  
}

// サブファンクション。
function mailSending(mailAddress, link) {

　// 件名。編集OK
  const subject = '【依頼:もふいべ2021】写真保存用リンクのアクセス確認依頼 - 返信不要'
  
  // 本文。写真保存用リンクの行以外は編集OK
  // \nで改行
  const body = '※返信不要\n\n' +
             'もふいべ2021の参加登録ありがとうございます。\n' + 
             'ご入力いただきましたメールアドレスへGoogleドライブのリンクを送付しております。\n' +
             'つきましては一度アクセスが可能かご確認をお願いいたします。\n' +
             '\n' +
             '写真・動画保存用リンク: https://drive.google.com/drive/folders/'+ link + 
             '\n\n'+
             '※誤って受信された場合はお手数をおかけいたしますが当メールの削除をお願いいたします。\n\n'+
             'このメールはもふいべ2021 AutoBot(Google Apps Script)より自動送信されています。\n';
                 
  // name で送信者名を指定、 noReplyで返信不可を指定しています。
  const options = { name: 'もふいべ2021 GAS-AutoBot', noReply : true };

  // メールを送信して当機能を終了
  GmailApp.sendEmail(mailAddress, subject, body, options);
}
