import { useRouter } from 'next/router'

function Resume({ ctx }) {
  const router = useRouter()
  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.push('/resume.pdf');
    return;
  }
}

Resume.getInitialProps = ctx => {
  // We check for ctx.res to make sure we're on the server.
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: '/resume.pdf' });
    ctx.res.end();
  }
  return { };
}

export default Resume
