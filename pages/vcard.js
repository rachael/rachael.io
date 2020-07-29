import StaticFileRedirect from 'components/StaticFileRedirect';

function VCard() {
  return StaticFileRedirect({
    staticFileUrl: '/Rachael Passov.vcf',
    renderComponent: null,
  })
}

export default VCard
