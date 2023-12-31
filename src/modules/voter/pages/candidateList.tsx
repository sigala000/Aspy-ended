import styled from '@emotion/styled';
import { Button } from 'antd';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CandidateEntity } from 'server/modules/candidate/entities/candidate.entity';
import { PostEntity } from 'server/modules/post/entities/post.entity';
import { ConnectedUser } from 'server/shared/customTypes';
import { fetchPosts } from 'src/modules/admin/network/admin.network';
import { fetchCandidates } from 'src/modules/candidate/network/candidate.network';
import { CandidateGuard } from 'src/modules/shared/AuthGuard';
import { Layout } from 'src/modules/shared/Layout';
import { ROUTES } from 'src/routes';
import { PRIMARY } from 'src/shared/colors';
import { DisplayPost } from '../components/displayPost';

const ApplicationContainer = styled.div`
  padding: 10px;
  margin-bottom: 30px;
  border: 2px solid ${PRIMARY};

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    h2 {
      margin-right: 20px;
      text-align: center;
    }
  }
`;

export const CandidateList = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [posts, setPosts] = useState<PostEntity[]>([]);
  const [candidates, setCandidates] = useState<CandidateEntity[]>([]);
  const [connectedUser, setConnectedUser] = useState<ConnectedUser>();

  useEffect(() => {
    fetchPosts().then((posts) => setPosts(posts));
    fetchCandidates().then((candidates) => setCandidates(candidates));
  }, []);

  useEffect(() => {
    if (session) {
      setConnectedUser(session.user as ConnectedUser);
    }
  }, [session]);

  return (
    <Layout>
      <CandidateGuard>
        {connectedUser?.apply && (
          <ApplicationContainer>
            <div>
              <h2>Complete your application to a given post</h2>
              <Button
                type='primary'
                size='large'
                style={{
                  backgroundColor: PRIMARY,
                  borderColor: 'transparent',
                }}
                onClick={() => router.push(ROUTES.CANDIDATE.APPLICATION)}
              >
                Application
              </Button>
            </div>
          </ApplicationContainer>
        )}
      </CandidateGuard>
      {/* <ApplicationContainer>
        <div>
          <h2>It is voting time! </h2>
          <Button
            type='primary'
            size='large'
            style={{
              backgroundColor: PRIMARY,
              borderColor: 'transparent',
            }}
            onClick={() => router.push(ROUTES.VOTER.VOTING)}
          >
            Vote your candidates.
          </Button>
        </div>
        <h3>When voting is over you will see the results here</h3>
      </ApplicationContainer> */}
      {/* <ApplicationContainer>
        <h2>It is not yet voting time, when it is time we will notify you.</h2>
      </ApplicationContainer> */}
      <ApplicationContainer>
        <div>
          <h2>Voting has ended ! </h2>
          <Button
            type='primary'
            size='large'
            style={{
              backgroundColor: PRIMARY,
              borderColor: 'transparent',
            }}
            onClick={() => router.push(ROUTES.ADMIN.RESULT_PAGE)}
          >
            See results
          </Button>
        </div>
        <h3>see the results here</h3>
      </ApplicationContainer> 
      <h2>List of all Candidates</h2>
      {posts.map((post) => (
        <DisplayPost
          key={post._id}
          post={post.name}
          candidates={candidates.filter(
            (candidate) => candidate.post == post._id,
          )}
        />
      ))}
    </Layout>
  );
};
