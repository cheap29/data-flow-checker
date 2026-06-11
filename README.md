# 要件設計サポートアプリ

業務要件を入力すると、AIが「データの流れ」と「影響範囲」を自動分析し、要件定義の抜け漏れ・矛盾・リスクを洗い出すWebアプリです。

## 主な機能

**分析内容**
- データの流れをアクター（ユーザー / フロントエンド / バックエンド / API / DB / 通知）別に可視化
- 影響を受ける画面・機能の一覧
- 利用者別の困りごと抽出
- 抜けていそうな仕様・矛盾・リスクの検出（重要度：高 / 中 / 低）
- 現場に確認したい質問の生成
- テスト観点（正常系・異常系・境界値）の提示

**UI**
- 「確認が必要なこと」「確定していること」の2区分で結果を整理
- チェックボックスで対応済み管理 + 進捗バー表示
- データの流れをアクターアイコン・データ状態バッジ付きタイムライン図で表示（シンプル表示と切替可能）
- PCでは2カラムレイアウト（左：チェックリスト / 右：データフロー図）、モバイルでは1カラムに折り返し
- Markdownコピー・JSON表示

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルをプロジェクトルートに作成し、OpenAI APIキーを設定してください。

```env
OPENAI_API_KEY=your_openai_api_key_here
```

APIキーは [OpenAI Platform](https://platform.openai.com/api-keys) から発行できます。  
**推奨：** キー作成時は権限を **Restricted（Model capabilities のみ）** に設定してください。

### 3. 起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## 使い方

1. テキストエリアに業務要件を貼り付ける（「サンプルを入れる」ボタンで試せます）
2. 「チェックする」ボタンをクリック
3. 分析結果が表示される
   - **右パネル**：データの流れを図で確認
   - **左パネル**：確認が必要な項目をチェックしながら要件を整理
4. 「Markdownコピー」で議事録・チケットに貼り付け

## 技術スタック

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [OpenAI API](https://platform.openai.com/) (gpt-5.4-mini)
- [Zod](https://zod.dev/) — AIレスポンスのバリデーション
- [Lucide React](https://lucide.dev/) — アイコン

## セキュリティ

- APIキーはサーバーサイド（Next.js Route Handler）のみで使用し、クライアントには露出しません
- `.env.local` はgitignore済みです。リポジトリにコミットしないでください
