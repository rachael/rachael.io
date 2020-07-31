import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

/*
  A URL prettifier component that can be used to redirect from a next.js page
  with a pretty URL to a static file with an uglier name instantly on render.

  Does not prevent redirect loops on back, so for internal Links recommend
  linking directly to the static file. This is more for visiting the URL
  directly from an external link.

  Includes the ability to provide a backup component to render if the static
  file will not render on its own.
*/
function StaticFileRedirect({
  staticFileUrl,
  renderComponent = null
 }) {
  const router = useRouter()
  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.replace(staticFileUrl);
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
