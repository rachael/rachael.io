import StaticFileRedirect from 'components/StaticFileRedirect';

function Resume() {
  return StaticFileRedirect({
    staticFileUrl: '/resume.pdf',
  })
}

export default Resume
