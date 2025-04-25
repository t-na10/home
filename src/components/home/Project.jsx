import React, { useState, useEffect, useCallback } from "react";
import Container from "react-bootstrap/Container";
import { Jumbotron } from "./migration";
import Row from "react-bootstrap/Row";
import ProjectCard from "./ProjectCard";
import axios from "axios";

const dummyProject = {
  id: null,
  name: null,
  description: null,
  svn_url: null,
  stargazers_count: null,
  languages_url: null,
  pushed_at: null,
};
const API = "https://api.github.com";
// const gitHubQuery = "/repos?sort=updated&direction=desc";
// const specficQuerry = "https://api.github.com/repos/hashirshoaeb/";

/**
 * Project Component to display GitHub repositories from multiple users.
 * @param {string} heading - The heading text for the section.
 * @param {string[]} usernames - An array of GitHub usernames.
 * @param {number} lengthPerUser - The number of most recent repos to fetch per user.
 * @param {Array<{username: string, repoNames: string[]}>} specificRepos - Array of objects specifying specific repos per user.
 */

const Project = ({ heading, usernames = [], lengthPerUser = 0, specificRepos = [] }) => {

  // ダミーカードの数を計算（概算）
  const totalSpecificCount = specificRepos.reduce((sum, spec) => sum + spec.repoNames.length, 0);
  const estimatedTotal = usernames.length * lengthPerUser + totalSpecificCount;
  const dummyProjectsArr = new Array(estimatedTotal > 0 ? estimatedTotal : 6).fill(dummyProject); // 最低6つ表示

  const [projectsArray, setProjectsArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRepos = useCallback(async () => {
    if (!usernames || usernames.length === 0) {
      setProjectsArray([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setProjectsArray([]); // 開始時にリセット

    const allPromises = [];
    const fetchedRepoIds = new Set(); // 重複排除用 (IDベース)
    let combinedRepos = [];

    // 1. 各ユーザーの最新リポジトリ取得のPromiseを作成
    usernames.forEach(username => {
      const reposApiUrl = `${API}/users/${username}/repos?sort=updated&direction=desc&per_page=${lengthPerUser}`;
      allPromises.push(axios.get(reposApiUrl));
    });

    // 2. 特定リポジトリ取得のPromiseを作成
    specificRepos.forEach(({ username, repoNames }) => {
      repoNames.forEach(repoName => {
        const specificRepoApiUrl = `${API}/repos/${username}/${repoName}`;
        // 最新リポジトリと重複する可能性があるので、ここではPromiseだけ作成
        allPromises.push(axios.get(specificRepoApiUrl).catch(err => {
          // 個別の特定リポジトリ取得エラーはコンソールに出力し、nullを返すなどで処理継続
          console.error(`Failed to fetch specific repo ${username}/${repoName}:`, err.message);
          return null; // or Promise.resolve(null)
        }));
      });
    });

    try {
      const responses = await Promise.allSettled(allPromises);

      responses.forEach(result => {
        // 成功し、データが存在する場合
        if (result.status === 'fulfilled' && result.value && result.value.data) {
          const data = result.value.data;
          // dataが配列（最新リスト）かオブジェクト（特定リポジトリ）かチェック
          const reposToAdd = Array.isArray(data) ? data : [data];

          reposToAdd.forEach(repo => {
            // 重複チェック (repo.idが存在する場合)
            if (repo && repo.id && !fetchedRepoIds.has(repo.id)) {
              combinedRepos.push(repo);
              fetchedRepoIds.add(repo.id);
            } else if (repo && !repo.id) {
              // IDがない場合（エラーケースなど）は、名前で簡易的にチェックするか、そのまま追加する
              // ここでは例としてそのまま追加（ただし重複の可能性あり）
              combinedRepos.push(repo);
              console.warn("Repo without ID found:", repo.name);
            }
          });
        } else if (result.status === 'rejected') {
          // 失敗したPromiseのエラー処理 (必要であれば)
          console.error("A repo fetch promise failed:", result.reason.message);
          if (!error) { // 最初のエラーメッセージを設定
            setError("リポジトリの一部が取得できませんでした。");
          }
        }
      });

      // 3. 結果をソート (例: pushed_at の降順)
      combinedRepos.sort((a, b) => {
        // pushed_at がない場合や無効な日付の場合は比較しないようにする
        const dateA = a.pushed_at ? new Date(a.pushed_at) : new Date(0);
        const dateB = b.pushed_at ? new Date(b.pushed_at) : new Date(0);
        return dateB - dateA;
      });

      setProjectsArray(combinedRepos);

    } catch (err) { // 全体的な予期せぬエラー
      console.error("Unexpected error during fetch:", err);
      setError("リポジトリの取得中に予期せぬエラーが発生しました。");
      setProjectsArray([]); // エラー時は空にする
    } finally {
      setLoading(false);
    }

  }, [usernames, lengthPerUser, specificRepos, error]); // error を依存配列に追加

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]); // fetchRepos は useCallback でメモ化されている

  return (
    <Jumbotron fluid id="projects" className="bg-light m-0">
      <Container className="">
        <h2 className="display-4 pb-5 text-center">{heading}</h2>

        {/* ローディング表示 */}
        {loading && <p className="text-center">Loading projects...</p>}

        {/* エラー表示 */}
        {error && <p className="text-center text-danger">{error}</p>}

        {/* 結果表示 */}
        <Row>
          {!loading && projectsArray.length > 0 ? (
            projectsArray.map((project) => (
              <ProjectCard
                // keyはユニークなものを指定 (idがあればベスト)
                key={project.id || `project-${project.full_name || project.name}`}
                id={`project-card-${project.id || project.full_name || project.name}`}
                value={project}
              />
            ))
          ) : !loading && !error && usernames && usernames.length > 0 ? (
            // ローディング完了、エラーなし、データなしの場合
            <p className="text-center">No projects found matching your criteria.</p>
          ) : (
            // ローディング中、またはエラーがある場合（エラーメッセージは別途表示される）
            // 必要に応じてダミーカードを表示（ここではローディング中にダミーを表示）
            loading && dummyProjectsArr.map((project, index) => (
              <ProjectCard
                key={`dummy-${index}`}
                id={`dummy-${index}`}
                value={project} // ダミーデータ
              />
            ))
          )}
        </Row>
      </Container>
    </Jumbotron>
  );
};

export default Project;
