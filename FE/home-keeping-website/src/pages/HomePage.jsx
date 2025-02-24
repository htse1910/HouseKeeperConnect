import React from 'react';
import HomePageHeader from '../components/HomePageHeader';
import HomePageUsersDesire from '../components/HomePageUsersDesire';
import HomePageUsersGuides from '../components/HomePageUsersGuides';
import HomePageUserStories from '../components/HomePageUserStories';

function HomePage() {
  return (
    <div>
      <HomePageHeader/>
      <HomePageUsersDesire/>
      <HomePageUsersGuides/>
      <HomePageUserStories/>
    </div>
  );
}

export default HomePage;
