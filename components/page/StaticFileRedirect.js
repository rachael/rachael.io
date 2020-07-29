import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

function StaticFileRedirect({
  staticFileUrl,
  renderComponent = null
 }) {
  const router = useRouter()
  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.push(staticFileUrl);
    return renderComponent;
  }
  return renderComponent;
}

StaticFileRedirect.getInitialProps = ctx => {
  // We check for ctx.res to make sure we're on the server.
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: this.props.staticFileUrl });
    ctx.res.end();
  }
  return { };
}

StaticFileRedirect.propTypes = {
  // URL of the static file that will be redirected to
  staticFileUrl: PropTypes.string,
  // Component to render if the filetype of the redirect does not render and
  // downloads instead, such as a .vcf file
  renderComponent: PropTypes.element,
}

export default StaticFileRedirect;
