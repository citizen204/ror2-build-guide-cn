import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="not-found page-shell">
      <h1 data-page-title="" tabIndex={-1}>没有找到这份角色攻略</h1>
      <p>链接可能已经失效，或者这名角色还不在当前攻略名单中。</p>
      <Link className="primary-link" to="/">返回角色首页</Link>
    </main>
  )
}
