import { useState } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare, faTwitterSquare, faRedditSquare, faGithubSquare } from '@fortawesome/free-brands-svg-icons'
import {
  PageHeader,
  RoadmapMeta,
  ShareRoadmap,
  Sidebar,
  Summary,
  SummaryContainer,
  MobileNavHeader,
  SidebarButton,
  MobileSidebar,
  MobileSidebarWrap,
  DesktopSidebarWrap,
  PageTitle,
  PageDetail
} from './style';
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { getFacebookShareUrl } from 'lib/url';
import { ShareIcon } from 'components/share-icon';
import { getRedditShareUrl, getTwitterShareUrl } from 'lib/url';
import siteConfig from "content/site";
import MdRenderer from 'components/md-renderer';

const DetailedRoadmap = ({ roadmap }) => {
  const [menuActive, setMenuState] = useState(false);
  const {
    sidebar = {},
    page: currentPage = {},
    author = {}
  } = roadmap;

  const roadmapPages = Object.keys(sidebar || {}).map((groupTitle, groupCounter) => {
    if (groupTitle.startsWith('_')) {
      return;
    }

    // @todo remove it after completing the frontend roadmap
    const isInProgress = groupCounter !== 0;

    return (
      <div className={`links-group ${isInProgress ? 'in-progress' : ''}`} key={groupTitle}>
        <h3>
          { groupTitle }
          { isInProgress && <span className='badge badge-warning progress-badge'>In Progress</span> }
        </h3>
        <ul>
          { sidebar[groupTitle].map(page => {
            const isActivePage = page.url === currentPage.url;
            // e.g. /frontend should mark `/frontend/landscape` as active
            const isSummaryPage = page.url === `${currentPage.url}/summary`;

            return (
              <li className={classNames({ active: isActivePage || isSummaryPage })} key={page.url}>
                <a href={ page.url }>
                  <span className="bullet"></span>
                  { page.title }
                </a>
              </li>
            );
          }) }
        </ul>
      </div>
    );
  });

  const filePath = currentPage.path.replace(/^\//, '');
  const RoadmapContent = require(`../../content/${filePath}`).default;

  return (
    <SummaryContainer>
      <PageHeader className="border-top border-bottom text-center text-md-left">
        <div className="container d-flex align-items-center flex-column flex-md-row">
          <RoadmapMeta>
            <h3>{ roadmap.title }</h3>
            <p>
              Roadmap contributed by <a href={ author.url } target="_blank">{ author.name }</a>
              { roadmap.contributorsCount > 1 && ` and <a href="${roadmap.contributorsUrl}">${roadmap.contributorsCount} others</a>`}
            </p>
          </RoadmapMeta>
          <ShareRoadmap className="mt-2 mt-md-0">
            <ShareIcon href={ siteConfig.url.repo } target="_blank">
              <FontAwesomeIcon icon={ faGithubSquare } />
            </ShareIcon>
            <ShareIcon href={ getFacebookShareUrl({ text: roadmap.title, url: roadmap.url }) } target="_blank">
              <FontAwesomeIcon icon={ faFacebookSquare } />
            </ShareIcon>
            <ShareIcon href={ getTwitterShareUrl({ text: roadmap.title, url: roadmap.url }) } target="_blank">
              <FontAwesomeIcon icon={ faTwitterSquare } />
            </ShareIcon>
            <ShareIcon href={ getRedditShareUrl({ text: roadmap.title, url: roadmap.url }) } target="_blank">
              <FontAwesomeIcon icon={ faRedditSquare } />
            </ShareIcon>
          </ShareRoadmap>
        </div>
      </PageHeader>

      <MobileNavHeader className="border-bottom d-block d-md-none">
        <div className="container">
          <SidebarButton onClick={() => setMenuState((prevMenuActive) => !prevMenuActive)}>
            <FontAwesomeIcon icon={ faBars } />
            { currentPage.title }
          </SidebarButton>
        </div>
        <MobileSidebarWrap className={classNames({ visible: menuActive })}>
          <div className="container">
            <MobileSidebar>
              { roadmapPages }
            </MobileSidebar>
          </div>
        </MobileSidebarWrap>
      </MobileNavHeader>

      <Summary className="container">
        <DesktopSidebarWrap className="d-none d-md-block">
          <Sidebar>
            { roadmapPages }
          </Sidebar>
        </DesktopSidebarWrap>
        <PageDetail>
          <PageTitle>{ currentPage.title }</PageTitle>
          <MdRenderer>
            <RoadmapContent />
          </MdRenderer>
        </PageDetail>
      </Summary>
    </SummaryContainer>
  )
};

export default DetailedRoadmap;
