import { Header, StaticFileRedirect } from 'components/page'

function Resume() {
  return StaticFileRedirect({
    staticFileUrl: '/Rachael Passov - Resume.pdf',
    renderComponent: <Header title="Resume" />,
  })
}

export default Resume
