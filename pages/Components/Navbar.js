import React, { Component } from 'react';
import { Button, Menu } from 'semantic-ui-react';
import { useState } from 'react';

function Navbar({ activeType }) {
  const handleItemClick = (e, name) => {
    setActiveItem(name);
  };
  const logout = () => { };

  return (
    <Menu pointing secondary>
      <Menu.Item header>TripFellas</Menu.Item>
      <Menu.Item
        name='dashboard'
        active={activeType === 'dashboard'}
        onClick={(e) => handleItemClick(e, 'dashboard')}
      >
        Dashboard
      </Menu.Item>
      <Menu.Item
        name='tours'
        active={activeType === 'tours'}
        onClick={(e) => handleItemClick(e, 'tours')}
      >
        Tours
      </Menu.Item>
      <Menu.Item
        name='reservations'
        active={activeType === 'reservations'}
        onClick={(e) => handleItemClick(e, 'reservations')}
      >
        Reservations
      </Menu.Item>
      <Menu.Item
        name='activityManagement'
        active={activeType === 'activityManagement'}
        onClick={(e) => handleItemClick(e, 'activityManagement')}
      >
        Activity Management
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item>
          <Button color='red' onClick={logout}>Logout</Button>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}

export default Navbar;
