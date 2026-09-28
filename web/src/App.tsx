import MainMenu from './components/MainMenu.tsx'
import IndexPage from './pages/IndexPage.tsx'

export default function App() {
  return (
    <>
      <MainMenu />
      <main className="content">
        <IndexPage />
      </main>
    </>
  )
}
