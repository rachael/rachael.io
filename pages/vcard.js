import { useRouter } from 'next/router'

/**
 * Static redirect for vcard file. Does not use StaticFileRedirect as there is
 * nothing to render; cannot use HOC/abstract as the key functionality is the
 * return statement directly from the functional component. This causes the
 * vcard file to start downloading without changing the window's location from
 * the user's perspective.
 */
function VCard({ ctx }) {
  const router = useRouter()
  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.push('/Rachael Passov.vcf');
    return;
  }
}

VCard.getInitialProps = ctx => {
  // We check for ctx.res to make sure we're on the server.
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: '/Rachael Passov.vcf' });
    ctx.res.end();
  }
  return { };
}

export default VCard
