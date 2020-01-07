/*
 * history/index.tsx
 *
 * scipnet - Frontend scripts for mekhane
 * Copyright (C) 2019 not_a_seagull
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

// contains methods for geting and converting page history, as well as a widget
import * as $ from "jquery";
import * as BluebirdPromise from "bluebird";

import { DeedsSuccessResult } from "./../deeds/basic-request";
import { getHistory } from "./../deeds";
import { h, Component } from "preact";
import { IntlProviders, Text as IntlText } from "preact-i18n";
import { Nullable } from "./../utils";
import { Pager } from "./../widgets/pager";
import { Revision } from "./revision";

const revisionsPerPageOptions = [
  10,
  20,
  50,
  100,
  200
];

// a radio button in a row in a revision table
interface CompareSelectionRadioProps {
  revKey: number;
  isTo: boolean;
}

function CompareSelectionRadio(props: CompareSelectionRadioProps) {
  // make sure we only do the string concat operation once
  const rkAsString = `${props.revKey}`;

  return (
    <input type="radio" id={rkAsString} value={rkAsString}
      name={props.isTo ? "to" : "from"} />
  );
}

// represents a row in the history table
interface RevisionRowProps {
  revision: Revision;
}

function RevisionRow(props: RevisionRowProps) {
  const revKey = props.revision.revKey;
  const editedOn = props.revision.editedOn;

  // TODO: action switch buttons
  // TODO: standardize date
  return (
    <tr id={`revision-${revKey}`}>
      <td>{props.revision.revId}</td>
      <td>
        <CompareSelectionRadio revKey={revKey} isTo={false} />
        <CompareSelectionRadio revKey={revKey} isTo={true} />
      </td>
      <td>{props.revision.flag}</td>
      <td></td>
      <td>{`${editedOn.getMonth()} ${editedOn.getDay()} ${editedOn.getFullYear()}`}</td>
      <td>{props.revision.comment}</td>
    </tr>
  );
}

export interface HistoryWidgetState {
  revisions: Array<Revision>;
  page: number;
  revisionsPerPage: number;
  totalPages: number;

  doingInitLoading: boolean;
}

export class HistoryWidget extends Component<{}, HistoryWidgetState> {
  ongoingRequest: Nullable<BluebirdPromise<void>>;

  constructor(props: {}) { 
    super(props);

    this.ongoingRequest = null;

    this.state = {
      revisions: [],
      page: 0,
      revisionsPerPage: 20,
      totalPages: 0,
 
      doingInitLoading: true
    };
  }

  // load new revisions
  private loadRevisions() {
    this.ongoingRequest = getHistory(this.state.page, this.state.revisionsPerPage)
      .then((res: DeedsSuccessResult) => {
        const { result } = res;

        this.ongoingRequest = null;
        this.setState((prevState: HistoryWidgetState): HistoryWidgetState => {
          const revisions = (result.revisions as Array<any>).map(Revision.deserialize);
          return Object.assign({}, prevState, { 
            doingInitLoading: false,
            revisions,
            totalPages: result.totalPages as number
          });
        });
      });
  }
 
  // run when component has mounted
  componentDidMount() {
    this.loadRevisions();
  }

  // if there's an ongoing request when the component is unmounted, cancel it
  componentWillUnmount() {
    if (this.ongoingRequest) {
      this.ongoingRequest.cancel();
    }
  }

  componentDidUpdate(prevProps: {}, prevState: HistoryWidgetState) {
    // only load new revisions if the state's page/revisions per page was updated
    if (this.state.page !== prevState.page ||
        this.state.revisionsPerPage !== prevState.revisionsPerPage) {
      this.loadRevisions();
    }
  }

  // needs to be async because the pager only takes async functions
  async switchPage(page: number): Promise<void> {
    return new Promise((resolve: () => void) => {
      this.setState((prevState: HistoryWidgetState): HistoryWidgetState => {
        return Object.assign({}, prevState, { page });
      }, resolve);
    });
  }

  // change the number of revisions per page
  changeRevisionsPerPage(e: Event) {
    const selector = e.target as HTMLSelectElement;
    this.setState((prevState: HistoryWidgetState): HistoryWidgetState => {
      return Object.assign({}, prevState, { revisionsPerPage: selector.options[selector.selectedIndex].value });
    });
  }

  render() {
    const pageSwitchFunction = async (p: number): Promise<void> => await this.switchPage(p);

    // if we're still loading, just display a simple loading block
    if (this.state.doingInitLoading) {
      return (
        <IntlProvider definition={definition}>
          <p style="text-align: center"><IntlText id="history.load">Loading...</IntlText></p>
        </IntlProvider>
      );
    }

    const rppOptions = revisionsPerPageOptions.map((rpp: number) => {
      const selected = this.state.revisionsPerPage === rpp;
      return <option value={rpp} selected={selected}>{rpp}</option>;
    });

    const revisionList = this.state.revisions.map((revision: Revision) => {
      return <RevisionRow revision={revision} />;
    });

    return (
      <IntlProvider definition={definition}>
        <form id="utility-history-block">
          <table class="form">
            <tbody>
              <tr>
                <td><IntlText id="rpp">Revisions per page:</IntlText></td>
                <td>
                  <select onChange={(e: Event) => this.changeRevisionsPerPage(e)}>
                    {rppOptions}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div id="buttons">
            <input id="update-button"
                   class="btn btn-default btn-sm"
                   type="button"
                   value="Update List" 
                   onClick={this.loadRevisions.bind(this)} />
            <input id="compare-button"
                   class="btn btn-default btn-sm"
                   type="button"
                   value="Compare versions" />
          </div>
          <div id="revision-list">
            <Pager totalPages={this.state.totalPages} 
              startPage={this.state.page} 
              onPageSwitch={pageSwitchFunction} 
            />
            <table class="page-history">
              <tbody>
                <tr>
                  <td><IntlText id="history.rev">rev.</IntlText></td>
                  <td>&nbsp;</td>
                  <td><IntlText id="history.flags">flags</IntlText></td>
                  <td><IntlText id="history.ations">actions</IntlText></td>
                  <td><IntlText id="history.by">by</IntlText></td>
                  <td><IntlText id="history.date">date</IntlText></td>
                  <td><IntlText id="history.comments">comments</IntlText></td>
                </tr>
                {revisionList}
              </tbody>
            </table>
          </div>
        </form>
      </IntlProvider>
    );
  }
}
