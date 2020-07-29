import { useRouter } from 'next/router'

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
