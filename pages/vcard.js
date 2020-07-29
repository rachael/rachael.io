import { StaticFileRedirect } from 'components/page';

function VCard() {
  return StaticFileRedirect({
    staticFileUrl: '/Rachael Passov.vcf',
    renderComponent: null, // TODO: render vcard placeholder
  })
}

export default VCard
