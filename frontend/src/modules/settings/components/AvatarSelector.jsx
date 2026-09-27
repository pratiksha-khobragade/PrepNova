// =====================================================
// PrepNova - Avatar Selector
// =====================================================

import React from "react";

import {
  faCheck,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import boy1 from "../../../../images/boy1.png";
import boy2 from "../../../../images/boy2.png";
import boy3 from "../../../../images/boy3.png";
import boy4 from "../../../../images/boy4.png";
import boy5 from "../../../../images/boy5.png";

import girl1 from "../../../../images/girl1.png";
import girl2 from "../../../../images/girl2.png";
import girl3 from "../../../../images/girl3.png";
import girl4 from "../../../../images/girl4.png";
import girl5 from "../../../../images/girl5.png";

import "./AvatarSelector.css";


// =====================================================
// Avatar Data
// =====================================================

const BOY_AVATARS = [
  {
    id: "boy-1",
    image: boy1,
  },
  {
    id: "boy-2",
    image: boy2,
  },
  {
    id: "boy-3",
    image: boy3,
  },
  {
    id: "boy-4",
    image: boy4,
  },
  {
    id: "boy-5",
    image: boy5,
  },
];

const GIRL_AVATARS = [
  {
    id: "girl-1",
    image: girl1,
  },
  {
    id: "girl-2",
    image: girl2,
  },
  {
    id: "girl-3",
    image: girl3,
  },
  {
    id: "girl-4",
    image: girl4,
  },
  {
    id: "girl-5",
    image: girl5,
  },
];


// =====================================================
// Avatar Card
// =====================================================

const AvatarCard = ({
  avatar,
  selected,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`avatar-option ${
        selected ? "selected" : ""
      }`}
      onClick={() =>
        onClick(avatar.id)
      }
      aria-label={`Select ${avatar.id}`}
    >

      <div className="avatar-option-image">

        <img
          src={avatar.image}
          alt={avatar.id}
        />

      </div>


      {selected && (
        <span className="avatar-selected-check">
          <FontAwesomeIcon
            icon={faCheck}
          />
        </span>
      )}

    </button>
  );
};


// =====================================================
// Avatar Selector
// =====================================================

const AvatarSelector = ({
  selectedAvatar,
  onSelectAvatar,
}) => {
  return (
    <div className="avatar-selector">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="avatar-selector-header">

        <div className="avatar-selector-icon">
          <FontAwesomeIcon
            icon={faUser}
          />
        </div>

        <div>
          <h3>
            Choose an Avatar
          </h3>

          <p>
            Select an avatar for your
            PrepNova profile.
          </p>
        </div>

      </div>


      {/* =================================================
          BOYS
      ================================================= */}

      <div className="avatar-category">

        <h4>
          Boys
        </h4>

        <div className="avatar-grid">

          {BOY_AVATARS.map(
            (avatar) => (
              <AvatarCard
                key={avatar.id}
                avatar={avatar}
                selected={
                  selectedAvatar ===
                  avatar.id
                }
                onClick={
                  onSelectAvatar
                }
              />
            )
          )}

        </div>

      </div>


      {/* =================================================
          GIRLS
      ================================================= */}

      <div className="avatar-category">

        <h4>
          Girls
        </h4>

        <div className="avatar-grid">

          {GIRL_AVATARS.map(
            (avatar) => (
              <AvatarCard
                key={avatar.id}
                avatar={avatar}
                selected={
                  selectedAvatar ===
                  avatar.id
                }
                onClick={
                  onSelectAvatar
                }
              />
            )
          )}

        </div>

      </div>

    </div>
  );
};


export default AvatarSelector;