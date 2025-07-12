import React from "react";
import "../asset/css/MessagePage.css";
import { FaSearch, FaCheckDouble } from "react-icons/fa";

const MessagePage = () => {
  return (
    <div className="kaab-message-page">
      <div className="kaab-sidebar">
        <div className="kaab-search">
          <input type="text" placeholder="Search name" />
          <button><FaSearch /></button>
        </div>
        <div className="kaab-messages-title">Messages</div>
        <div className="kaab-message-list">
          <div className="kaab-message-item active">
            <img src="/images/emilli.png" alt="Emily" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>Emily Roberts</span>
                <span>4:30 PM</span>
              </div>
              <div className="kaab-message-preview typing">Typing...</div>
            </div>
            <span className="kaab-unread-count">2</span>
          </div>
          <div className="kaab-message-item">
            <img src="/images/sophia.png" alt="Sophia" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>Sophia Williams</span>
                <span>12:30 PM</span>
              </div>
              <div className="kaab-message-preview">Thank you.</div>
            </div>
          </div>
          <div className="kaab-message-item">
            <img src="/images/james.png" alt="James" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>James Carter</span>
                <span>1:36 PM</span>
              </div>
              <div className="kaab-message-preview">
                Looking forward to tomorrow’s event!
              </div>
            </div>
            <img src="/images/Checks.svg" alt="read" className="kaab-read"/>
          </div>
          <div className="kaab-message-item">
            <img src="/images/sophia.png" alt="Olivia" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>Olivia Brown</span>
                <span>2:15 PM</span>
              </div>
              <div className="kaab-message-preview">Can’t wait for the presentation!</div>
            </div>
          </div>
          <div className="kaab-message-item">
            <img src="/images/james.png" alt="Ethan" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>Ethan Davis</span>
                <span>3:00 PM</span>
              </div>
              <div className="kaab-message-preview">I hope everyone is ready!</div>
            </div>
            <img src="/images/Checks.svg" alt="read" className="kaab-read"/>
          </div>
          <div className="kaab-message-item">
            <img src="/images/sophia.png" alt="Ava" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>Ava Johnson</span>
                <span>3:45 PM</span>
              </div>
              <div className="kaab-message-preview">Let’s make this a great session!</div>
            </div>
          </div>
          <div className="kaab-message-item">
            <img src="/images/james.png" alt="Liam" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>Liam Smith</span>
                <span>4:10 PM</span>
              </div>
              <div className="kaab-message-preview">Will there be snacks available?</div>
            </div>
            <img src="/images/Checks.svg" alt="read" className="kaab-read"/>
          </div>
          <div className="kaab-message-item">
            <img src="/images/sophia.png" alt="Isabella" />
            <div className="kaab-message-info">
              <div className="kaab-message-name-time">
                <span>Isabella Martinez</span>
                <span>4:30 PM</span>
              </div>
              <div className="kaab-message-preview">Excited to see everyone!</div>
            </div>
          </div>
        </div>
      </div>

      <div className="kaab-chat-panel">
        <div className="kaab-chat-header">
          <div className="kaab-chat-title">Samantha Lee</div>
          <div className="kaab-chat-subtitle">Exclusive Beach Party – Energetic Hostess Required</div>
        </div>
        <div className="kaab-chat-body">
          <div className="kaab-chat-message sender">
            <img src="/images/emilli.png" alt="Emily" />
            <div>
              <div className="kaab-chat-name-time">Emily Roberts <span>10:00 AM</span></div>
              <div className="kaab-chat-text">Hi Samantha, hope you’re doing well! I’m reaching out regarding the upcoming Exclusive Beach Party. Just wanted to check if you received all the event details.</div>
            </div>
          </div>
          <div className="kaab-chat-message sender">
            <img src="/images/samantha.png" alt="Emily" />
            <div>
              <div className="kaab-chat-name-time">Samantha Lee <span>10:05 AM</span></div>
              <div className="kaab-chat-text">Hi Emily, yes, I received everything and I’m really excited for the gig! Could you please confirm what time I should arrive?</div>
            </div>
          </div>
          <div className="kaab-chat-message sender">
            <img src="/images/emilli.png" alt="Emily" />
            <div>
              <div className="kaab-chat-name-time">Emily Roberts <span>10:08 AM</span></div>
              <div className="kaab-chat-text">Absolutely. The event starts at 4:00 PM, but we’d like you to arrive by 3:45 PM for a brief setup meeting.</div>
            </div>
          </div>
          <div className="kaab-chat-message sender">
            <img src="/images/samantha.png" alt="Emily" />
            <div>
              <div className="kaab-chat-name-time">Samantha Lee <span>10:10 AM</span></div>
              <div className="kaab-chat-text">Great, thanks for the confirmation! Also, could you remind me of the dress code?</div>
            </div>
          </div>
          <div className="kaab-chat-message sender">
            <img src="/images/emilli.png" alt="Emily" />
            <div>
              <div className="kaab-chat-name-time">Emily Roberts <span>10:15 AM</span></div>
              <div className="kaab-chat-text">Sure! The dress code is Beach Formal—think smart summer dress with comfortable yet stylish footwear.</div>
            </div>
          </div>
        </div>
        <div className="kaab-chat-input">
          <input type="text" placeholder="Type your message" />
          <button><img src="/images/Send.png" alt="send"/></button>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
