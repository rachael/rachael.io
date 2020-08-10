import { useDispatch, useSelector } from 'react-redux';

import { Profile, ProfileImg } from 'components/home';
import { Layout } from 'components/page';

import initialState from 'redux/initialState';
import { wiggle } from 'redux/actions';

export default function Home() {
  const dispatch = useDispatch();
  const wiggleEnabled = useSelector(state => state.wiggle);

  const footer = (
    <>
      <a href='#' onClick={() => dispatch(wiggle(!wiggleEnabled))}>wiggle</a>
    </>
  );

  return (
    <Layout footer={footer}>
      <ProfileImg />
      <Profile />
    </Layout>
  );
}

export function getStaticProps() {
  // Note that in this case we're returning the state directly, without creating
  // the store first (like in /pages/ssr.js), this approach can be better and easier
  return {
    props: {
      initialReduxState: initialState,
    },
  }
}
