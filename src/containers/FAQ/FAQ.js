import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { DisclosureArrow } from '../../components';
import { FAQ as messages } from '../../services/translations/messages';
import { performPushNotification } from '../../action_performers/notifications';
import { KEYBOARD_KEY_VALUES } from '../../constants';

import AppPage from '../__shared__/AppPage';

import './FAQ.css';

export class FAQ extends AppPage {
    constructor(props) {
        super(props);
        this.state = {
            expandedIds: []
        };
    }

    static mapStateToProps(state) {
        return {
            questions: state.App.localization.data.faq,
            error: state.App.localization.error.faq,
            loading: state.App.localization.loading.faq
        };
    }

    showError() {
        const { formatMessage } = this.context.intl;
        performPushNotification({ message: formatMessage(messages.error), type: 'error' });
    }

    componentDidMount() {
        const { error, loading } = this.props;
        if (!loading && error) {
            this.showError();
        }
    }

    componentDidUpdate(prevProps) {
        const { error, loading } = this.props;

        if (!loading && error && error !== prevProps.error) {
            this.showError();
        }
    }

    toggleExpandQuestion(id) {
        const searchedIndex = this.state.expandedIds.indexOf(id);
        const isIncludesSearchedId = searchedIndex !== -1;
        if (isIncludesSearchedId) {
            this.setState({
                expandedIds: [
                    ...this.state.expandedIds.slice(0, searchedIndex),
                    ...this.state.expandedIds.slice(searchedIndex + 1)
                ]
            });
        } else {
            this.setState({
                expandedIds: [...this.state.expandedIds, id]
            });
        }
    }

    handleQuestionEnterPress(event, id) {
        if (event.key === KEYBOARD_KEY_VALUES.ENTER) {
            this.toggleExpandQuestion(id);
        }
    }

    render() {
        const { formatMessage } = this.context.intl;
        return (
            <div className="faq-page">
                <h1>{formatMessage(messages.header)}</h1>
                {this.props.questions.map(({ question, answer, id }, index) => {
                    const isExpanded = this.state.expandedIds.indexOf(id) > -1;
                    const renderDangerouslyHTMLAnswer = () => (
                        <div
                            id={`${id}-${index}`}
                            aria-hidden={!!isExpanded ? undefined : true}
                            className="answer-container"
                            dangerouslySetInnerHTML={{ __html: answer }}
                        />
                    );
                    return (
                        <div
                            className={classNames('question-container', { 'question-container--expanded': isExpanded })}
                            key={id}
                            role="region"
                            aria-live="polite"
                        >
                            <div className="title-container">
                                <div
                                    aria-controls={`${id}-${index}`}
                                    aria-expanded={!!isExpanded ? true : undefined}
                                    tabIndex={0}
                                    className="title"
                                    onClick={() => this.toggleExpandQuestion(id)}
                                    onKeyUp={event => this.handleQuestionEnterPress(event, id)}
                                >
                                    {question}
                                </div>
                                <DisclosureArrow
                                    onClick={() => this.toggleExpandQuestion(id)}
                                    expanded={isExpanded}
                                    onKeyUp={event => this.handleQuestionEnterPress(event, id)}
                                />
                            </div>
                            {renderDangerouslyHTMLAnswer()}
                        </div>
                    );
                })}
            </div>
        );
    }
}

FAQ.contextTypes = {
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired
};

FAQ.propTypes = {
    questions: PropTypes.array,
    loading: PropTypes.bool,
    error: PropTypes.object
};

export default connect(FAQ.mapStateToProps)(FAQ);
