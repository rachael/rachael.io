import { useRouter } from 'next/router'

function StaticFileRedirect(props) {
  const router = useRouter()
  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.push(props.staticFileUrl);
    return props.renderComponent || null;
  }
  return props.renderComponent || null;
}

StaticFileRedirect.getInitialProps = ctx => {
  // We check for ctx.res to make sure we're on the server.
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: this.props.staticFileUrl });
    ctx.res.end();
  }
  return { };
}

export default StaticFileRedirect;
