import { StaticFileRedirect } from 'components/page';

function Resume() {
  return StaticFileRedirect({
    staticFileUrl: '/resume.pdf',
  })
}

export default Resume
